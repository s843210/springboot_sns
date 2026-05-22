import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api/auth';
import { getUsers } from '../api/users';
import './AuthPage.css';

export default function AuthPage() {
  const { loginUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await login(username, password);
        // JWT 파싱해서 userId 추출하거나 사용자 목록에서 찾기
        const users = await getUsers();
        const me = users.find((u) => u.username === username);
        loginUser(data.jwt, { id: me.id, username: me.username });
      } else {
        const newUser = await register(username, password);
        // 회원가입 후 자동 로그인
        const data = await login(username, password);
        loginUser(data.jwt, { id: newUser.id, username: newUser.username });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        (isLogin ? '로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.' : '회원가입에 실패했습니다.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-logo">
          <span className="auth-logo-icon">💬</span>
          <span className="auth-logo-text">Minlog</span>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              id="tab-login"
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              로그인
            </button>
            <button
              id="tab-register"
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              회원가입
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="auth-username">사용자명</label>
              <input
                id="auth-username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">비밀번호</label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button id="auth-submit" type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                isLogin ? '로그인' : '회원가입'
              )}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? (
              <>계정이 없으신가요? <button onClick={() => { setIsLogin(false); setError(''); }}>회원가입</button></>
            ) : (
              <>이미 계정이 있으신가요? <button onClick={() => { setIsLogin(true); setError(''); }}>로그인</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
