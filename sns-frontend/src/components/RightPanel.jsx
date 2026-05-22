import './RightPanel.css';

const AVATARS = ['🦊', '🐺', '🦁', '🐯', '🦄', '🐸', '🦋', '🐧', '🦅', '🐬'];
const getAvatar = (name) => {
  if (!name) return '👤';
  return AVATARS[name.charCodeAt(0) % AVATARS.length];
};

export default function RightPanel({
  users,
  followList,
  currentUser,
  isFollowing,
  onFollow,
  onUnfollow,
  onSelectUser,
}) {
  const followeeIds = followList.map((f) => f.followeeId);

  return (
    <aside className="right-panel">
      <div className="right-panel-header">
        <h2 className="right-panel-title">멤버</h2>
        <span className="right-panel-count">{users.length}</span>
      </div>

      <div className="right-panel-section-label">멤버 — {users.length}</div>

      <div className="right-panel-list">
        {users.map((u) => {
          const isSelf = u.id === currentUser?.id;
          const following = isFollowing(u.id);

          return (
            <div key={u.id} className="right-member" id={`member-${u.id}`}>
              <button
                className="right-member-info"
                onClick={() => !isSelf && onSelectUser(u)}
              >
                <div className="right-avatar-wrap">
                  <span className="right-avatar">{getAvatar(u.username)}</span>
                </div>
                <div className="right-member-text">
                  <span className="right-member-name">
                    {u.username}
                    {isSelf && <span className="self-tag">나</span>}
                  </span>
                  <span className="right-member-sub">
                    {isSelf ? '본인' : following ? '팔로잉' : '팔로우 안 함'}
                  </span>
                </div>
              </button>

              {!isSelf && (
                following ? (
                  <button
                    id={`unfollow-btn-${u.id}`}
                    className="right-follow-btn following"
                    onClick={() => onUnfollow(u.id)}
                    title="언팔로우"
                  >
                    ✓
                  </button>
                ) : (
                  <button
                    id={`follow-right-btn-${u.id}`}
                    className="right-follow-btn"
                    onClick={() => onFollow(u.id)}
                    title="팔로우"
                  >
                    +
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
