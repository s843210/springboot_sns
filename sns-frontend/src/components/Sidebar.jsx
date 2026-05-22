import { useState, useEffect } from 'react';
import { updateUser } from '../api/users';
import './Sidebar.css';

const AVATARS = ['🦊', '🐺', '🦁', '🐯', '🦄', '🐸', '🦋', '🐧', '🦅', '🐬'];

const getAvatar = (name) => {
  if (!name) return '👤';
  return AVATARS[name.charCodeAt(0) % AVATARS.length];
};

export default function Sidebar({
  user,
  users,
  posts,
  followList,
  activeChannel,
  onSelectChannel,
  onLogout,
  isFollowing,
  onFollow,
  onUnfollow,
}) {
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    const lastVisit = localStorage.getItem('lastFeedVisit');
    if (!lastVisit || !posts?.length) return;
    const hasNewPost = posts.some(
      (p) => new Date(p.createdAt) > new Date(lastVisit)
    );
    setHasNew(hasNewPost);
  }, [posts]);

  const handleSelectFeed = () => {
    localStorage.setItem('lastFeedVisit', new Date().toISOString());
    setHasNew(false);
    onSelectChannel('feed', '📡 피드');
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', password: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const handleProfileSave = async () => {
    if (!profileForm.username.trim()) return;
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateUser(user.id, {
        username: profileForm.username,
        password: profileForm.password || undefined,
      });
      setProfileMsg('저장되었습니다! 다시 로그인해 주세요.');
    } catch (e) {
      setProfileMsg('저장 실패: ' + (e.response?.data || e.message));
    } finally {
      setProfileSaving(false);
    }
  };



  const followeeIds = followList.map((f) => f.followeeId);
  const followingUsers = users.filter((u) => followeeIds.includes(u.id) && u.id !== user.id);


  const otherUsers = users.filter((u) => u.id !== user.id && !followeeIds.includes(u.id));

  return (
    <aside className="sidebar">
      {/* 워크스페이스 헤더 */}
      <div className="sidebar-header">
        <div className="workspace-name">
          <span className="workspace-icon">💬</span>
          <span className="workspace-text">Minlog</span>
        </div>
        <div className="workspace-status">
          <span className="status-dot"></span>
          <span className="status-name">{user?.username}</span>
        </div>
      </div>

      {/* 채널 섹션 */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">채널</div>
        <button
          id="channel-feed"
          className={`sidebar-item ${activeChannel === 'feed' ? 'active' : ''}`}
          onClick={handleSelectFeed}
        >
          <span className="sidebar-item-icon">#</span>
          <span>피드</span>
          {hasNew && <span className="sidebar-badge-new">NEW</span>}
        </button>
        <button
          id="channel-my"
          className={`sidebar-item ${activeChannel === 'my' ? 'active' : ''}`}
          onClick={() => onSelectChannel('my', '📝 내 게시글')}
        >
          <span className="sidebar-item-icon">#</span>
          <span>내 게시글</span>
        </button>
      </nav>

      {/* 팔로잉 DM */}
      <div className="sidebar-nav">
        <div className="sidebar-section-label">
          팔로잉 ({followingUsers.length})
        </div>
        {followingUsers.length === 0 && (
          <p className="sidebar-empty">팔로우한 유저가 없습니다</p>
        )}
        {followingUsers.map((u) => (
          <button
            key={u.id}
            id={`dm-user-${u.id}`}
            className={`sidebar-item sidebar-dm ${activeChannel === `user-${u.id}` ? 'active' : ''}`}
            onClick={() => onSelectChannel(`user-${u.id}`, `@${u.username}`)}
          >
            <span className="dm-avatar">{getAvatar(u.username)}</span>
            <span className="dm-name">{u.username}</span>
          </button>
        ))}
      </div>

      {/* 전체 유저 */}
      <div className="sidebar-nav sidebar-users">
        <div className="sidebar-section-label">
          모든 유저 ({otherUsers.length})
        </div>
        {otherUsers.map((u) => (
          <div
            key={u.id}
            className="sidebar-item sidebar-user-item"
          >
            <button
              className="user-row"
              onClick={() => onSelectChannel(`user-${u.id}`, `@${u.username}`)}
            >
              <span className="dm-avatar">{getAvatar(u.username)}</span>
              <span className="dm-name">{u.username}</span>
            </button>
            <button
              id={`follow-btn-${u.id}`}
              className="follow-btn"
              onClick={() => onFollow(u.id)}
            >
              +팔로우
            </button>
          </div>
        ))}
      </div>

      {/* 하단 사용자 정보 */}
      <div className="sidebar-footer">
        <button
          id="profile-edit-btn"
          className="sidebar-user"
          onClick={() => { setProfileForm({ username: user?.username || '', password: '' }); setProfileMsg(''); setShowProfileModal(true); }}
          title="프로필 수정"
        >
          <span className="sidebar-user-avatar">{getAvatar(user?.username)}</span>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.username}</span>
            <span className="sidebar-user-edit-hint">클릭하여 수정</span>
          </div>
        </button>
        <button id="logout-btn" className="logout-btn" onClick={onLogout} title="로그아웃">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {/* 프로필 수정 모달 */}
      {showProfileModal && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="profile-modal-title">프로필 수정</h3>
            <label className="profile-label">사용자명</label>
            <input
              id="profile-username-input"
              className="profile-input"
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              placeholder="새 사용자명"
            />
            <label className="profile-label">새 비밀번호 (변경 시에만 입력)</label>
            <input
              id="profile-password-input"
              className="profile-input"
              type="password"
              value={profileForm.password}
              onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
              placeholder="새 비밀번호"
            />
            {profileMsg && <p className="profile-msg">{profileMsg}</p>}
            <div className="profile-modal-actions">
              <button className="profile-cancel-btn" onClick={() => setShowProfileModal(false)}>취소</button>
              <button
                id="profile-save-btn"
                className="profile-save-btn"
                onClick={handleProfileSave}
                disabled={profileSaving}
              >
                {profileSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
