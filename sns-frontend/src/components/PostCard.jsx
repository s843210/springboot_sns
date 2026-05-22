import { useState, useEffect } from 'react';
import { toggleLike, getLikeStatus } from '../api/articles';
import { getComments, createComment, deleteComment } from '../api/comments';
import './PostCard.css';

const AVATARS = ['🦊', '🐺', '🦁', '🐯', '🦄', '🐸', '🦋', '🐧', '🦅', '🐬'];

const getAvatar = (name) => {
  if (!name) return '👤';
  return AVATARS[name.charCodeAt(0) % AVATARS.length];
};

const formatTime = (dt) => {
  if (!dt) return '';
  const d = new Date(dt);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return '방금 전';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

export default function PostCard({ post, currentUser, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentPosting, setCommentPosting] = useState(false);
  const isOwner = currentUser?.id === post.authorId;

  useEffect(() => {
    getLikeStatus(post.articleId)
      .then((data) => { setLikeCount(data.likeCount); setLikedByMe(data.likedByMe); })
      .catch(() => {});

    // 댓글 수를 처음부터 로드해서 작성자도 바로 확인 가능
    getComments(post.articleId)
      .then((data) => setComments(data))
      .catch(() => {});
  }, [post.articleId]);

  const fetchComments = async () => {
    try {
      const data = await getComments(post.articleId);
      setComments(data);
    } catch (e) { console.error(e); }
  };

  const handleToggleComments = () => {
    // 열 때마다 최신 댓글 갱신
    if (!showComments) fetchComments();
    setShowComments((v) => !v);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentDraft.trim() || commentPosting) return;
    setCommentPosting(true);
    try {
      await createComment(post.articleId, commentDraft.trim());
      setCommentDraft('');
      fetchComments();
    } finally {
      setCommentPosting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(post.articleId, commentId);
      fetchComments();
    } catch (e) { console.error(e); }
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const data = await toggleLike(post.articleId);
      setLikeCount(data.likeCount);
      setLikedByMe(data.likedByMe);
    } catch (e) {
      console.error(e);
    } finally {
      setLiking(false);
    }
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await onEdit(post.articleId, editContent.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await onDelete(post.articleId);
    }
    setShowMenu(false);
  };

  return (
    <div className="post-card" id={`post-${post.articleId}`}>
      <div className="post-avatar">{getAvatar(post.authorName)}</div>
      <div className="post-body">
        <div className="post-header">
          <span className="post-author">{post.authorName}</span>
          <span className="post-time">{formatTime(post.createdAt)}</span>
          {isOwner && (
            <div className="post-menu-wrapper">
              <button
                id={`post-menu-${post.articleId}`}
                className="post-menu-btn"
                onClick={() => setShowMenu(!showMenu)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
              {showMenu && (
                <div className="post-dropdown">
                  <button
                    id={`edit-post-${post.articleId}`}
                    className="dropdown-item"
                    onClick={() => { setEditing(true); setShowMenu(false); }}
                  >
                    ✏️ 수정
                  </button>
                  <button
                    id={`delete-post-${post.articleId}`}
                    className="dropdown-item danger"
                    onClick={handleDelete}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="post-edit">
            <textarea
              id={`edit-textarea-${post.articleId}`}
              className="post-edit-input"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              autoFocus
            />
            <div className="post-edit-actions">
              <button
                id={`cancel-edit-${post.articleId}`}
                className="edit-cancel-btn"
                onClick={() => { setEditing(false); setEditContent(post.content); }}
              >
                취소
              </button>
              <button
                id={`save-edit-${post.articleId}`}
                className="edit-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        ) : (
          <div className="post-content">
            {post.content}
            {post.imageUrl && (
              <div className="post-image-container">
                <img src={post.imageUrl} alt="post" className="post-image" />
              </div>
            )}
          </div>
        )}

        {/* 좋아요 + 댓글 버튼 */}
        <div className="post-actions">
          <button
            id={`like-btn-${post.articleId}`}
            className={`like-btn ${likedByMe ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={liking}
          >
            <span className="like-icon">{likedByMe ? '❤️' : '🤍'}</span>
            <span className="like-count">{likeCount}</span>
          </button>
          <button
            id={`comment-toggle-btn-${post.articleId}`}
            className={`comment-toggle-btn ${showComments ? 'active' : ''}`}
            onClick={handleToggleComments}
          >
            💬 <span>{comments.length > 0 || showComments ? comments.length : ''} 댓글</span>
          </button>
        </div>

        {/* 댓글 영역 */}
        {showComments && (
          <div className="comments-section">
            {comments.map((c) => (
              <div key={c.commentId} className="comment-item" id={`comment-${c.commentId}`}>
                <span className="comment-avatar">{getAvatar(c.authorName)}</span>
                <div className="comment-body">
                  <span className="comment-author">{c.authorName}</span>
                  <span className="comment-content">{c.content}</span>
                </div>
                {currentUser?.id === c.authorId && (
                  <button
                    id={`delete-comment-${c.commentId}`}
                    className="comment-delete-btn"
                    onClick={() => handleCommentDelete(c.commentId)}
                    title="삭제"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input
                id={`comment-input-${post.articleId}`}
                className="comment-input"
                placeholder="댓글 작성..."
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
              />
              <button
                id={`comment-submit-${post.articleId}`}
                type="submit"
                className="comment-submit-btn"
                disabled={!commentDraft.trim() || commentPosting}
              >
                {commentPosting ? '...' : '등록'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
