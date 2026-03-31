import { useEffect, useState } from 'react';
import { apiRequest } from '../api/apiClient';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { formatApiError } from '../utils/formatApiError';

function statusLabel(status) {
  if (status === 1 || status === 'Scheduled') return 'Đã đặt';
  if (status === 2 || status === 'Cancelled') return 'Đã hủy';
  if (status === 3 || status === 'Confirmed') return 'Đã xác nhận';
  return String(status);
}

function isScheduled(status) {
  return status === 1 || status === 'Scheduled' || status === 3 || status === 'Confirmed';
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const { showToast } = useToast();

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest('/api/appointments/me', {});
      setAppointments(res);
    } catch (err) {
      setError(formatApiError(err));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    if (
      !window.confirm(
        'Hủy lịch này? Bạn chỉ có thể đặt lại cùng khung giờ nếu slot còn trống.'
      )
    ) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      await apiRequest(`/api/appointments/${id}`, { method: 'DELETE' });
      showToast('Đã hủy lịch khám.', 'success');
      await load();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <h2>Lịch khám của tôi</h2>
      <p className="page-lead">Xem và hủy lịch đã đặt. Lịch đã hủy không chặn đặt lại cùng khung giờ.</p>

      <ErrorBox message={error} />

      {loading ? (
        <div className="inline-loading" style={{ marginTop: 16 }}>
          <Spinner /> <span className="muted">Đang tải lịch…</span>
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Chưa có lịch nào"
          hint="Vào mục Bác sĩ để chọn bác sĩ và đặt lịch."
        />
      ) : (
        <div className="section" style={{ marginTop: 12 }}>
          {appointments.map((a) => (
            <div
              key={a.id}
              className="card"
              style={{ padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{a.doctorName}</div>
                <div className="muted">{a.specialtyName}</div>
                <div style={{ marginTop: 8 }}>
                  <span className="muted">Ngày:</span> {a.appointmentDate}{' '}
                  <span className="muted">· Giờ:</span> {a.timeSlot}
                </div>
                <div style={{ marginTop: 6 }}>
                  <span className="muted">Trạng thái:</span> <strong>{statusLabel(a.status)}</strong>
                </div>
              </div>

              {isScheduled(a.status) ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => cancelAppointment(a.id)}
                  disabled={busyId !== null}
                >
                  {busyId === a.id ? (
                    <span className="inline-loading">
                      <Spinner small /> Đang hủy…
                    </span>
                  ) : (
                    'Hủy lịch'
                  )}
                </button>
              ) : (
                <button type="button" className="btn" disabled>
                  Đã hủy
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
