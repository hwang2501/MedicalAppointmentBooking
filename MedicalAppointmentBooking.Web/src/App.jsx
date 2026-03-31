import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TopNav from './components/TopNav';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSpecialtiesPage from './pages/admin/AdminSpecialtiesPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import { getRoleFromToken } from './auth/jwtUtils';
import { getToken } from './auth/authStorage';
import { ToastProvider } from './context/ToastContext';
import './App.css';

export default function App() {
  const token = getToken();
  const role = getRoleFromToken(token);

  return (
    <BrowserRouter>
      <ToastProvider>
      <TopNav />

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RequireRole role="Patient">
                  <PatientDashboardPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <RequireRole role="Patient">
                  <DoctorsPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments/me"
            element={
              <ProtectedRoute>
                <RequireRole role="Patient">
                  <AppointmentsPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RequireRole role="Admin">
                  <AdminDashboardPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/specialties"
            element={
              <ProtectedRoute>
                <RequireRole role="Admin">
                  <AdminSpecialtiesPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute>
                <RequireRole role="Admin">
                  <AdminDoctorsPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute>
                <RequireRole role="Admin">
                  <AdminPatientsPage />
                </RequireRole>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
