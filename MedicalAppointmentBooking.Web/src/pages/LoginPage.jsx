import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/apiClient';
import { setToken } from '../auth/authStorage';
import { getRoleFromToken } from '../auth/jwtUtils';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { formatApiError } from '../utils/formatApiError';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    if (u.length < 3) {
      setError('Tên đăng nhập tối thiểu 3 ký tự.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { username: u, password }
      });

      setToken(res.accessToken);
      showToast('Đăng nhập thành công.', 'success');

      const role = getRoleFromToken(res.accessToken);
      if (role === 'Admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card card-soft auth-card">
        <h2>Đăng nhập</h2>
        <p style={{ marginBottom: 14, color: '#666' }}>
          Dùng tài khoản bệnh nhân (đăng ký) hoặc admin được cấp.
        </p>
        <form onSubmit={onSubmit} className="form-grid">
          <label>
            <span className="label">Tên đăng nhập</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            <span className="label">Mật khẩu</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? (
              <span className="inline-loading">
                <Spinner small /> Đang xử lý…
              </span>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>
        <ErrorBox message={error} />
        <p style={{ marginTop: 12 }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký bệnh nhân</Link>
        </p>
      </div>
    </div>
  );
}
