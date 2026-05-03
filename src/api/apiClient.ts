const BASE_URL = '';

async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const userId = localStorage.getItem('userId');
  if (userId) {
    headers['X-User-Id'] = userId;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  get<T>(path: string, withAuth = false) {
    return request<T>(path, { method: 'GET' }, withAuth);
  },
  post<T>(path: string, body: unknown, withAuth = false) {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body) }, withAuth);
  },
  put<T>(path: string, body: unknown, withAuth = false) {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, withAuth);
  },
  patch<T>(path: string, body: unknown, withAuth = false) {
    return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, withAuth);
  },
  delete<T>(path: string, withAuth = false) {
    return request<T>(path, { method: 'DELETE' }, withAuth);
  },
};