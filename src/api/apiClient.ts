const BASE_URL = '';

async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false,
  retry = true  // ← para evitar loop infinito
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
  if (userId) headers['X-User-Id'] = userId;

  const userName = localStorage.getItem('userName');
  if (userName) headers['X-User-Name'] = userName;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // ← interceptar 401 y refrescar token
  if (res.status === 401 && withAuth && retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // reintentar el request original con el nuevo token
      return request<T>(path, options, withAuth, false);
    } else {
      // refresh falló → logout
      clearSession();
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
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