import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/apiClient';
import ErrorBox from '../../components/ErrorBox';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { formatApiError } from '../../utils/formatApiError';

function statusLabel(status) {
  if (status === 1 || status === 'Scheduled') return 'Đã đặt';
  if (status === 2 || status === 'Cancelled') return 'Đã hủy';
  if (status === 3 || status === 'Confirmed') return 'Đã xác nhận';
  return String(status);
}

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  async function loadPatients(searchTerm = '') {
    setLoading(true);
    setError(null);
    try {
      const qs = searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : '';
      const res = await apiRequest(`/api/admin/patients${qs}`, {});
      setPatients(res);
    } catch (err) {
      setError(formatApiError(err));
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  async function openDetails(patient) {
    setSelectedPatient(patient);
    setLoadingDetails(true);
    setError(null);
    try {
      const res = await apiRequest(`/api/admin/patients/${patient.id}`, {});
      setDetails(res);
    } catch (err) {
      setError(formatApiError(err));
      setDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }

  async function updateAppointmentStatus(appointmentId, status) {
    if (status === 'Cancelled' && !window.confirm('Bạn chắc chắn muốn hủy lịch hẹn này?')) return;
    setUpdatingStatusId(appointmentId);
    setError(null);
    try {
      await apiRequest(`/api/admin/patients/appointments/${appointmentId}/status`, {
        method: 'PUT',
        body: { status }
      });

      if (selectedPatient) {
        await openDetails(selectedPatient);
      }
      await loadPatients(search);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setUpdatingStatusId(null);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="page">
      <h2>Quản lý bệnh nhân</h2>
      <p className="page-lead">Tìm bệnh nhân theo tên đăng nhập và xem lịch hẹn của từng người.</p>

      <ErrorBox message={error} />

      <div className="card card-soft" style={{ marginTop: 8 }}>
        <div className="toolbar">
          <label className="toolbar-grow">
            <span className="label">Tìm bệnh nhân</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập username..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') loadPatients(search);
              }}
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={() => loadPatients(search)} disabled={loading}>
            {loading ? 'Đang tải…' : 'Tìm'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="inline-loading" style={{ marginTop: 20 }}>
          <Spinner /> <span className="muted">Đang tải danh sách bệnh nhân…</span>
        </div>
      ) : patients.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <EmptyState icon="🧑‍⚕️" title="Chưa có bệnh nhân" hint="Hãy đăng ký tài khoản bệnh nhân trước." />
        </div>
      ) : (
        <div className="admin-table-wrap" style={{ marginTop: 16 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Số lịch đã tạo</th>
                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.username}</strong></td>
                  <td>{p.totalAppointments}</td>
                  <td>
                    <button type="button" className="btn" onClick={() => openDetails(p)}>
                      Xem lịch hẹn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPatient && (
        <div className="card" style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>Lịch hẹn của: {selectedPatient.username}</h3>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSelectedPatient(null);
                setDetails(null);
              }}
            >
              Đóng
            </button>
          </div>

          {loadingDetails ? (
            <div className="inline-loading" style={{ marginTop: 12 }}>
              <Spinner small /> <span className="muted">Đang tải chi tiết…</span>
            </div>
          ) : !details || details.appointments.length === 0 ? (
            <div style={{ marginTop: 12 }}>
              <EmptyState icon="📅" title="Bệnh nhân chưa có lịch hẹn" />
            </div>
          ) : (
            <div className="admin-table-wrap" style={{ marginTop: 12 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bác sĩ</th>
                    <th>Chuyên khoa</th>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {details.appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.doctorName}</td>
                      <td>{a.specialtyName}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.timeSlot}</td>
                      <td>{statusLabel(a.status)}</td>
                      <td>
                        <div className="row-actions">
                          {(a.status === 1 || a.status === 'Scheduled') && (
                            <button
                              type="button"
                              className="btn btn-primary"
                              disabled={updatingStatusId !== null}
                              onClick={() => updateAppointmentStatus(a.id, 'Confirmed')}
                            >
                              {updatingStatusId === a.id ? 'Đang cập nhật…' : 'Xác nhận'}
                            </button>
                          )}
                          {(a.status !== 2 && a.status !== 'Cancelled') && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              disabled={updatingStatusId !== null}
                              onClick={() => updateAppointmentStatus(a.id, 'Cancelled')}
                            >
                              {updatingStatusId === a.id ? 'Đang cập nhật…' : 'Hủy hẹn'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

