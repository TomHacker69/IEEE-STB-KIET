import { auth } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAuthToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    const devToken = localStorage.getItem('dev_admin_token');
    if (devToken) return devToken;
  }
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  get: (endpoint: string) => fetchApi(endpoint, { method: 'GET' }),
  post: (endpoint: string, body?: any) =>
    fetchApi(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint: string, body?: any) =>
    fetchApi(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),
  upload: async (file: File, folder: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const result = await fetchApi('/upload', {
      method: 'POST',
      body: formData,
    });
    return result.url;
  },
};

