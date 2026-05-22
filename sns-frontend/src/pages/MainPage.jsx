import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFeed, getArticlesByUser, createArticle, deleteArticle, updateArticle } from '../api/articles';
import { getUsers, follow, unfollow, getFollowList } from '../api/users';
import Sidebar from '../components/Sidebar';
import MessageArea from '../components/MessageArea';
import RightPanel from '../components/RightPanel';
import './MainPage.css';

export default function MainPage() {
  const { user, logoutUser } = useAuth();

  // 채널: 'feed' | 'my' | 'user-{id}'
  const [activeChannel, setActiveChannel] = useState('feed');
  const [channelLabel, setChannelLabel] = useState('피드');

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [followList, setFollowList] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);

  // 초기 로드
  useEffect(() => {
    fetchUsers();
    fetchFollowList();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeChannel]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  const fetchFollowList = async () => {
    try {
      const data = await getFollowList(user.id);
      setFollowList(data);
    } catch (e) { console.error(e); }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      let data = [];
      if (activeChannel === 'feed') {
        data = await getFeed(user.id);
      } else if (activeChannel === 'my') {
        data = await getArticlesByUser(user.id);
      } else if (activeChannel.startsWith('user-')) {
        const targetId = Number(activeChannel.split('-')[1]);
        data = await getArticlesByUser(targetId);
      }
      // 최신순 정렬
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(data);
    } catch (e) {
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePost = async (content, imageUrl) => {
    try {
      await createArticle(content, imageUrl);
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (articleId) => {
    try {
      await deleteArticle(articleId);
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleEdit = async (articleId, content) => {
    try {
      await updateArticle(articleId, content);
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleFollow = async (followeeId) => {
    try {
      await follow(followeeId);
      fetchFollowList();
    } catch (e) { console.error(e); }
  };

  const handleUnfollow = async (followeeId) => {
    try {
      await unfollow(user.id, followeeId);
      fetchFollowList();
    } catch (e) { console.error(e); }
  };

  const isFollowing = (targetId) => followList.some((f) => f.followeeId === targetId);

  const selectChannel = (channel, label) => {
    setActiveChannel(channel);
    setChannelLabel(label);
  };

  return (
    <div className="main-page">
      <Sidebar
        user={user}
        users={users}
        posts={posts}
        followList={followList}
        activeChannel={activeChannel}
        onSelectChannel={selectChannel}
        onLogout={logoutUser}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />

      <MessageArea
        channel={activeChannel}
        channelLabel={channelLabel}
        posts={posts}
        loading={loadingPosts}
        currentUser={user}
        onPost={handlePost}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRefresh={fetchPosts}
        rightOpen={rightOpen}
        onToggleRight={() => setRightOpen(!rightOpen)}
      />

      {rightOpen && (
        <RightPanel
          users={users}
          followList={followList}
          currentUser={user}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onSelectUser={(u) => selectChannel(`user-${u.id}`, `@${u.username}`)}
        />
      )}
    </div>
  );
}
