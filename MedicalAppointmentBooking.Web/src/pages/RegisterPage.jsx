import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/apiClient';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { formatApiError } from '../utils/formatApiError';

export default function RegisterPage() {
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
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { username: u, password }
      });
      showToast('Đăng ký thành công. Vui lòng đăng nhập.', 'success');
      navigate('/login');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card card-soft auth-card">
        <h2>Đăng ký bệnh nhân</h2>
        <p style={{ marginBottom: 14, color: '#666' }}>
          Sau khi đăng ký bạn có thể tìm bác sĩ và đặt lịch khám.
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
              autoComplete="new-password"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? (
              <span className="inline-loading">
                <Spinner small /> Đang tạo tài khoản…
              </span>
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>
        <ErrorBox message={error} />
        <p style={{ marginTop: 12 }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
