import { getToken } from '../auth/authStorage';

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl() {
  // Defined in .env.local
  return import.meta.env.VITE_API_BASE_URL || '';
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest(path, { method = 'GET', body = undefined, token = undefined } = {}) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error('Chưa cấu hình VITE_API_BASE_URL.');

  const headers = {
    'Content-Type': 'application/json'
  };

  const authToken = token ?? getToken();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    const msg =
      e instanceof TypeError && String(e.message || '').includes('fetch')
        ? 'Không kết nối được server (Failed to fetch). Kiểm tra API đang chạy và CORS.'
        : (e?.message || 'Lỗi mạng');
    throw new ApiError(msg, 0, null);
  }

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    const message =
      data?.detail ||
      data?.title ||
      (data?.errors ? 'Dữ liệu không hợp lệ' : null) ||
      response.statusText ||
      `Request failed (${response.status})`;

    throw new ApiError(message, response.status, data);
  }

  if (response.status === 204) return null;
  return await response.json();
}

