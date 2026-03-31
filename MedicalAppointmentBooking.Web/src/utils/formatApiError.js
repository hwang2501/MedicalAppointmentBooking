import { ApiError } from '../api/apiClient';

/** Chuẩn hóa message lỗi từ fetch / ApiError / ASP.NET ProblemDetails + validation */
export function formatApiError(err) {
  if (err == null) return 'Lỗi không xác định.';
  if (typeof err === 'string') return err;

  if (err instanceof TypeError) {
    if (String(err.message || '').toLowerCase().includes('fetch')) {
      return 'Không kết nối được server. Hãy bật API, kiểm tra VITE_API_BASE_URL và CORS.';
    }
  }

  if (err instanceof ApiError) {
    const d = err.details;
    if (d?.errors && typeof d.errors === 'object') {
      const lines = [];
      for (const [field, msgs] of Object.entries(d.errors)) {
        const arr = Array.isArray(msgs) ? msgs : [msgs];
        for (const m of arr) lines.push(`${field}: ${m}`);
      }
      if (lines.length) return lines.join(' · ');
    }
    if (d?.detail) return d.detail;
    if (d?.title && d.title !== 'One or more validation errors occurred') return d.title;
    if (err.message) return err.message;
  }

  if (err.message) return err.message;
  return 'Yêu cầu thất bại.';
}
