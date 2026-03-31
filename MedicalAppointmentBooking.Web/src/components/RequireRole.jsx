import { Navigate } from 'react-router-dom';
import { getToken } from '../auth/authStorage';
import { getRoleFromToken } from '../auth/jwtUtils';

export default function RequireRole({ role, children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  const currentRole = getRoleFromToken(token);
  if (currentRole !== role) return <Navigate to="/" replace />;

  return children;
}

