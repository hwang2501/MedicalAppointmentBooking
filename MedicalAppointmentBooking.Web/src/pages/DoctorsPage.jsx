import { useCallback, useEffect, useRef, useState } from 'react';
import { apiRequest } from '../api/apiClient';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { formatApiError } from '../utils/formatApiError';
import { todayISODate } from '../utils/date';

export default function DoctorsPage() {
  const [specialties, setSpecialties] = useState([]);
  const [query, setQuery] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctors, setDoctors] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(todayISODate);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [timeSlot, setTimeSlot] = useState('');

  const [pageError, setPageError] = useState(null);
  const [bookError, setBookError] = useState(null);
  const [loadingBoot, setLoadingBoot] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [booking, setBooking] = useState(false);

  const { showToast } = useToast();
  const skipDebouncedSearch = useRef(true);

  const runListFetch = useCallback(async () => {
    setLoadingDoctors(true);
    setPageError(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('Query', query.trim());
      if (specialtyId) params.set('SpecialtyId', specialtyId);
      const qs = params.toString();
      const path = `/api/doctors${qs ? `?${qs}` : ''}`;
      const res = await apiRequest(path, {});
      setDoctors(res);
    } catch (err) {
      setPageError(formatApiError(err));
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [query, specialtyId]);

  /* Lần đầu: chỉ chạy một lần — tải chuyên khoa + danh sách bác sĩ (chưa lọc) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingBoot(true);
      setPageError(null);
      try {
        const specs = await apiRequest('/api/specialties', {});
        if (!cancelled) setSpecialties(specs);
        const all = await apiRequest('/api/doctors', {});
        if (!cancelled) setDoctors(all);
      } catch (err) {
        if (!cancelled) setPageError(formatApiError(err));
      } finally {
        if (!cancelled) setLoadingBoot(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Khi đổi bộ lọc: debounce gọi lại API (bỏ qua lần mount đầu) */
  useEffect(() => {
    if (skipDebouncedSearch.current) {
      skipDebouncedSearch.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      runListFetch();
    }, 450);
    return () => window.clearTimeout(t);
  }, [query, specialtyId, runListFetch]);

  function runSearchNow() {
    runListFetch();
  }

  function onKeySearch(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearchNow();
    }
  }

  async function bookAppointment() {
    if (!selectedDoctor) return;
    if (!timeSlot) {
      setBookError('Vui lòng chọn khung giờ còn trống.');
      return;
    }
    setBookError(null);
    setBooking(true);
    try {
      await apiRequest('/api/appointments', {
        method: 'POST',
        body: {
          doctorId: selectedDoctor.id,
          appointmentDate,
          timeSlot
        }
      });
      showToast('Đặt lịch thành công.', 'success');
      await runListFetch();
      setSelectedDoctor(null);
    } catch (err) {
      setBookError(formatApiError(err));
    } finally {
      setBooking(false);
    }
  }

  const minDate = todayISODate();

  useEffect(() => {
    if (!selectedDoctor) {
      setAvailableSlots([]);
      setTimeSlot('');
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadingSlots(true);
      setBookError(null);
      try {
        const res = await apiRequest(
          `/api/doctors/${selectedDoctor.id}/available-slots?date=${encodeURIComponent(appointmentDate)}`,
          {}
        );
        if (cancelled) return;
        const slots = Array.isArray(res?.availableTimeSlots) ? res.availableTimeSlots : [];
        setAvailableSlots(slots);
        setTimeSlot((prev) => (slots.includes(prev) ? prev : (slots[0] || '')));
      } catch (err) {
        if (cancelled) return;
        setAvailableSlots([]);
        setTimeSlot('');
        setBookError(formatApiError(err));
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedDoctor, appointmentDate]);

  return (
    <div className="page">
      <h2>Tìm bác sĩ & đặt lịch</h2>
      <p className="page-lead">
        Chọn chuyên khoa hoặc nhập tên bác sĩ để tìm nhanh, sau đó chọn bác sĩ phù hợp để đặt lịch khám.
      </p>

      <ErrorBox message={pageError} />

      <div className="card card-soft" style={{ maxWidth: 920 }}>
        {loadingBoot ? (
          <div className="inline-loading" style={{ padding: '12px 0' }}>
            <Spinner /> <span className="muted">Đang tải danh sách…</span>
          </div>
        ) : (
          <>
            <div className="toolbar">
              <label className="toolbar-grow">
                <span className="label">Tên bác sĩ</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeySearch}
                  placeholder="Ví dụ: Nguyễn"
                />
              </label>
              <label style={{ minWidth: 220 }}>
                <span className="label">Chuyên khoa</span>
                <select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)}>
                  <option value="">Tất cả</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn btn-primary" onClick={runSearchNow} disabled={loadingDoctors}>
                {loadingDoctors ? (
                  <span className="inline-loading">
                    <Spinner small /> Đang tìm…
                  </span>
                ) : (
                  'Tìm ngay'
                )}
              </button>
            </div>

            <div className="muted" style={{ marginBottom: 8 }}>
              {loadingDoctors ? 'Đang tải…' : `Tìm thấy ${doctors.length} bác sĩ.`}
            </div>

            {doctors.length === 0 && !loadingDoctors ? (
              <EmptyState
                icon="👨‍⚕️"
                title="Không có bác sĩ phù hợp"
                hint="Thử bỏ lọc chuyên khoa hoặc nhập tên ngắn hơn."
              />
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {doctors.map((d) => (
                  <div
                    key={d.id}
                    className="card card-muted"
                    style={{
                      padding: 14,
                      boxShadow: 'none',
                      borderRadius: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{d.name}</div>
                      <div className="muted">{d.specialtyName}</div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setSelectedDoctor(d)}>
                      Đặt lịch
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedDoctor && (
        <div className="card card-soft" style={{ marginTop: 18, maxWidth: 520 }}>
          <h3 style={{ marginTop: 0 }}>Xác nhận lịch khám</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            Bác sĩ: <strong>{selectedDoctor.name}</strong> · {selectedDoctor.specialtyName}
          </p>
          <div className="form-grid">
            <label>
              <span className="label">Ngày khám</span>
              <input
                type="date"
                min={minDate}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </label>
            <label>
              <span className="label">Khung giờ</span>
              {loadingSlots ? (
                <div className="inline-loading">
                  <Spinner small /> <span className="muted">Đang tải khung giờ còn trống…</span>
                </div>
              ) : (
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} disabled={availableSlots.length === 0}>
                  {availableSlots.length === 0 ? (
                    <option value="">Không còn khung giờ trống</option>
                  ) : (
                    availableSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))
                  )}
                </select>
              )}
            </label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={bookAppointment}
              disabled={booking || loadingSlots || availableSlots.length === 0 || !timeSlot}
            >
              {booking ? (
                <span className="inline-loading">
                  <Spinner small /> Đang đặt…
                </span>
              ) : (
                'Xác nhận đặt lịch'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDoctor(null);
                setBookError(null);
              }}
              disabled={booking}
              className="btn btn-ghost"
            >
              Đóng
            </button>
          </div>
          <ErrorBox message={bookError} />
        </div>
      )}
    </div>
  );
}
