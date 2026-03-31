import { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../../api/apiClient';
import ErrorBox from '../../components/ErrorBox';
import Spinner from '../../components/Spinner';
import { useToast } from '../../context/ToastContext';
import { formatApiError } from '../../utils/formatApiError';

export default function AdminDoctorsPage() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [newName, setNewName] = useState('');
  const [newSpecialtyId, setNewSpecialtyId] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingSpecialtyId, setEditingSpecialtyId] = useState('');
  const [editingImageUrl, setEditingImageUrl] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { showToast } = useToast();

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  async function loadAll() {
    setError(null);
    setLoading(true);
    try {
      const [specs, docs] = await Promise.all([
        apiRequest('/api/specialties', {}),
        apiRequest('/api/doctors', {})
      ]);
      setSpecialties(specs);
      setDoctors(docs);
      if (!newSpecialtyId && specs[0]?.id) {
        setNewSpecialtyId(specs[0].id);
      }
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleFileUpload(file, setUrlCallback) {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // We bypass apiRequest since fetch needs formData without JSON headers
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5169/api/uploads/image', {
        method: 'POST',
        headers: {
           ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setUrlCallback('http://localhost:5169' + data.url);
      showToast('Tải ảnh thành công', 'success');
    } catch (err) {
      setError('Lỗi tải ảnh: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function create() {
    const name = newName.trim();
    if (!name || !newSpecialtyId) {
      setError('Nhập tên bác sĩ và chọn chuyên khoa.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiRequest('/api/doctors', {
        method: 'POST',
        body: { name, specialtyId: newSpecialtyId, imageUrl: newImageUrl }
      });
      setNewName('');
      setNewImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Đã thêm bác sĩ.', 'success');
      const docs = await apiRequest('/api/doctors', {});
      setDoctors(docs);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function update(id) {
    const name = editingName.trim();
    if (!name || !editingSpecialtyId) {
      setError('Tên và chuyên khoa không hợp lệ.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/doctors/${id}`, {
        method: 'PUT',
        body: { name, specialtyId: editingSpecialtyId, imageUrl: editingImageUrl }
      });
      setEditingId(null);
      setEditingName('');
      setEditingSpecialtyId('');
      setEditingImageUrl('');
      showToast('Đã cập nhật bác sĩ.', 'success');
      const docs = await apiRequest('/api/doctors', {});
      setDoctors(docs);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id, name) {
    if (!window.confirm(`Xóa bác sĩ "${name}"?`)) return;
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/doctors/${id}`, { method: 'DELETE' });
      showToast('Đã xóa bác sĩ.', 'info');
      const docs = await apiRequest('/api/doctors', {});
      setDoctors(docs);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h2>Quản lý bác sĩ</h2>
      <p className="page-lead">Gán mỗi bác sĩ vào một chuyên khoa. Bệnh nhân tìm theo tên và chuyên khoa.</p>

      <ErrorBox message={error} />

      <div className="card card-soft" style={{ marginTop: 8 }}>
        <div className="grid-3">
          <label>
            <span className="label">Tên bác sĩ</span>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="BS. Nguyễn Văn A" />
          </label>
          <label>
            <span className="label">Chuyên khoa</span>
            <select value={newSpecialtyId} onChange={(e) => setNewSpecialtyId(e.target.value)}>
              <option value="">Chọn chuyên khoa</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
             <span className="label">Ảnh đại diện</span>
             <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], setNewImageUrl)} />
             {uploadingImage && <span className="muted" style={{fontSize: 12}}>Đang tải...</span>}
             {newImageUrl && <img src={newImageUrl} alt="Preview" style={{height: 40, marginTop: 4, borderRadius: 20}} />}
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={create}
            disabled={busy || uploadingImage || !newName.trim() || !newSpecialtyId}
          >
            {busy ? 'Đang thêm…' : 'Thêm bác sĩ'}
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
                <th style={{width: 60}}>Ảnh</th>
                <th>Bác sĩ</th>
                <th>Chuyên khoa</th>
                <th style={{ width: 220 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td>
                    {editingId === d.id ? (
                       <div>
                         <input type="file" ref={editFileInputRef} accept="image/*" style={{width: 140, fontSize: 10}} onChange={(e) => handleFileUpload(e.target.files[0], setEditingImageUrl)} />
                         {editingImageUrl && <img src={editingImageUrl} alt="Preview" style={{height: 30, borderRadius: 15, display: 'block'}} />}
                       </div>
                    ) : (
                       d.imageUrl ? <img src={d.imageUrl} alt={d.name} style={{width: 40, height: 40, borderRadius: '50%', objectFit: 'cover'}} /> : <div style={{width: 40, height: 40, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                    ) : (
                      <strong>{d.name}</strong>
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <select value={editingSpecialtyId} onChange={(e) => setEditingSpecialtyId(e.target.value)}>
                        {specialties.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      d.specialtyName
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      {editingId === d.id ? (
                        <>
                          <button type="button" className="btn btn-primary" disabled={busy || uploadingImage} onClick={() => update(d.id)}>
                            Lưu
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={busy}
                            onClick={() => {
                              setEditingId(null);
                              setEditingName('');
                              setEditingSpecialtyId('');
                              setEditingImageUrl('');
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
                              setEditingId(d.id);
                              setEditingName(d.name);
                              setEditingSpecialtyId(d.specialtyId);
                              setEditingImageUrl(d.imageUrl || '');
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            disabled={busy}
                            onClick={() => remove(d.id, d.name)}
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
