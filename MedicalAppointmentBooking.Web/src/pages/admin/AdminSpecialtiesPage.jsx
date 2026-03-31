import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/apiClient';
import ErrorBox from '../../components/ErrorBox';
import Spinner from '../../components/Spinner';
import { useToast } from '../../context/ToastContext';
import { formatApiError } from '../../utils/formatApiError';

export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest('/api/specialties', {});
      setSpecialties(res);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const name = newName.trim();
    if (!name) {
      setError('Nhập tên chuyên khoa.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiRequest('/api/specialties', {
        method: 'POST',
        body: { name }
      });
      setNewName('');
      showToast('Đã thêm chuyên khoa.', 'success');
      await load();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function update(id) {
    const name = editingName.trim();
    if (!name) {
      setError('Tên không được để trống.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/specialties/${id}`, {
        method: 'PUT',
        body: { name }
      });
      setEditingId(null);
      setEditingName('');
      showToast('Đã cập nhật chuyên khoa.', 'success');
      await load();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id, name) {
    if (!window.confirm(`Xóa chuyên khoa "${name}"? (Nếu còn bác sĩ gắn vào có thể lỗi khóa ngoại tùy dữ liệu.)`)) return;
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/specialties/${id}`, { method: 'DELETE' });
      showToast('Đã xóa chuyên khoa.', 'info');
      await load();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h2>Quản lý chuyên khoa</h2>
      <p className="page-lead">Thêm, sửa, xóa chuyên khoa. Tên nên rõ ràng để bệnh nhân lọc dễ.</p>

      <ErrorBox message={error} />

      <div className="card card-soft" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ flex: '1 1 260px' }}>
            <span className="label">Tên chuyên khoa mới</span>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ví dụ: Nội khoa" />
          </label>
          <button type="button" className="btn btn-primary" onClick={create} disabled={busy}>
            {busy ? 'Đang lưu…' : 'Thêm'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="inline-loading" style={{ marginTop: 20 }}>
          <Spinner /> <span className="muted">Đang tải…</span>
        </div>
      ) : (
        <div className="admin-table-wrap" style={{ marginTop: 16 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Id</th>
                <th style={{ width: 220 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((s) => (
                <tr key={s.id}>
                  <td>
                    {editingId === s.id ? (
                      <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                    ) : (
                      <strong>{s.name}</strong>
                    )}
                  </td>
                  <td className="mono">{s.id}</td>
                  <td>
                    <div className="row-actions">
                      {editingId === s.id ? (
                        <>
                          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => update(s.id)}>
                            Lưu
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={busy}
                            onClick={() => {
                              setEditingId(null);
                              setEditingName('');
                            }}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn"
                            disabled={busy}
                            onClick={() => {
                              setEditingId(s.id);
                              setEditingName(s.name);
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            disabled={busy}
                            onClick={() => remove(s.id, s.name)}
                          >
                            Xóa
                          </button>
                        </>
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
  );
}
