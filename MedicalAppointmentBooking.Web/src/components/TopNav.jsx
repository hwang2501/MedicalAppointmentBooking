import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../auth/authStorage';
import { getRoleFromToken, getUsernameFromToken } from '../auth/jwtUtils';

export default function TopNav() {
  const navigate = useNavigate();
  const token = getToken();
  const role = getRoleFromToken(token);
  const username = getUsernameFromToken(token);
  const roleLabel = role === 'Admin' ? 'Quản trị' : role === 'Patient' ? 'Bệnh nhân' : role;

  function onLogout() {
    clearToken();
    navigate('/login');
  }

  return (
    <div className="top-nav">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <span className="nav-brand-dot" />
        <span>Phòng Khám Huỳnh Hoàng</span>
      </div>

      <div className="nav-links">
        <NavLink to="/">Trang chủ</NavLink>
        {token && (
          <>
            {role === 'Patient' && (
              <>
                <NavLink to="/dashboard">Tổng quan</NavLink>
                <NavLink to="/doctors">Bác sĩ</NavLink>
                <NavLink to="/appointments/me">Lịch của tôi</NavLink>
              </>
            )}
            {role === 'Admin' && (
              <>
                <NavLink to="/admin/dashboard">Tổng quan</NavLink>
                <NavLink to="/admin/specialties">Chuyên khoa</NavLink>
                <NavLink to="/admin/doctors">Quản lý bác sĩ</NavLink>
                <NavLink to="/admin/patients">Quản lý bệnh nhân</NavLink>
              </>
            )}
          </>
        )}
        {!token && (
          <>
            <NavLink to="/login">Đăng nhập</NavLink>
            <NavLink to="/register">Đăng ký</NavLink>
          </>
        )}
      </div>

      <div className="nav-user">
        {token && (
          <>
            <span className="nav-username" title={username || ''}>
              {username || '—'}
            </span>
            {roleLabel && <span className="nav-badge">{roleLabel}</span>}
            <button type="button" className="btn btn-ghost" onClick={onLogout}>
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </div>
  );
}
