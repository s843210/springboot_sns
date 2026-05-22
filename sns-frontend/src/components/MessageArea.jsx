import { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../api/articles';
import PostCard from './PostCard';
import './MessageArea.css';

export default function MessageArea({
  channel,
  channelLabel,
  posts,
  loading,
  currentUser,
  onPost,
  onDelete,
  onEdit,
  onRefresh,
  rightOpen,
  onToggleRight,
}) {
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // 새 포스트 올 때 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!draft.trim() && !selectedImage) || posting) return;
    setPosting(true);
    try {
      let imageUrl = null;
      if (selectedImage) {
        const uploadRes = await uploadImage(selectedImage);
        imageUrl = uploadRes.imageUrl;
      }
      await onPost(draft.trim(), imageUrl);
      setDraft('');
      removeImage();
      textareaRef.current?.focus();
    } catch (err) {
      console.error(err);
      alert('업로드 또는 작성 실패: ' + (err.response?.data?.message || err.response?.data || err.message));
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const channelIcon = channel === 'feed' ? '📡' : channel === 'my' ? '📝' : '👤';

  return (
    <main className="message-area">
      {/* 헤더 */}
      <div className="message-header">
        <div className="channel-info">
          <span className="channel-icon-header">{channelIcon}</span>
          <div>
            <h1 className="channel-title">{channelLabel}</h1>
            <p className="channel-meta">
              {posts.length}개의 포스트
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button id="refresh-btn" className="header-btn" onClick={onRefresh} title="새로고침">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button id="toggle-right-btn" className={`header-btn ${rightOpen ? 'active' : ''}`} onClick={onToggleRight} title="멤버 패널">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div className="messages-scroll">
        {loading ? (
          <div className="messages-loading">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="messages-empty">
            <span className="empty-icon">💬</span>
            <p className="empty-title">아직 포스트가 없습니다</p>
            <p className="empty-desc">첫 번째 포스트를 작성해보세요!</p>
          </div>
        ) : (
          <>
            {[...posts].reverse().map((post) => (
              <PostCard
                key={post.articleId}
                post={post}
                currentUser={currentUser}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* 메시지 입력창 */}
      <div className="message-input-area">
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button className="remove-image-btn" onClick={removeImage}>×</button>
          </div>
        )}
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <button
              type="button"
              className="attach-btn"
              onClick={() => fileInputRef.current?.click()}
              title="이미지 첨부"
            >
              📎
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <textarea
              ref={textareaRef}
              id="post-input"
              className="message-input"
              placeholder={`${channelLabel}에 메시지 보내기...`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <div className="input-actions">
              <span className="input-hint">Enter 전송 · Shift+Enter 줄바꿈</span>
              <button
                id="post-submit-btn"
                type="submit"
                className="send-btn"
                disabled={(!draft.trim() && !selectedImage) || posting}
              >
                {posting ? (
                  <span className="send-spinner"></span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
