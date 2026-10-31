// Único punto de acceso HTTP del frontend. Ninguna página llama a fetch directamente.
// Modo de datos: VITE_DATA_MODE=api (predeterminado, usa el backend) o demo (localStorage, sin servidor).
const env = import.meta.env ?? {};
const BASE = (env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const mode = env.VITE_DATA_MODE || 'api';

// El token vive solo mientras la pestaña esté abierta (sessionStorage). Fuera del navegador se usa memoria.
const memory = new Map();
const storage = typeof sessionStorage !== 'undefined'
  ? sessionStorage
  : { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v), removeItem: (k) => memory.delete(k) };
const TOKEN_KEY = 'economica.token';
export const getToken = () => storage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? storage.setItem(TOKEN_KEY, t) : storage.removeItem(TOKEN_KEY));

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'ERROR', details = null } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// request('/api/products') · request('/api/products', {method:'POST', body:{...}})
// auth:false → sin token (login). quiet:true → un 401 no dispara el cierre automático de sesión.
export async function request(path, { method = 'GET', body, auth = true, quiet = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.', { code: 'NETWORK_ERROR' });
  }
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && auth && token && !quiet && onUnauthorized) onUnauthorized();
    throw new ApiError(data?.message || 'Error de API', { status: res.status, code: data?.code, details: data?.details });
  }
  return data;
}

export const endpoints = {
  products: '/api/products',
  inventory: '/api/inventory',
  movements: '/api/inventory/movements',
  login: '/api/auth/login',
  reports: '/api/reports/inventory',
  users: '/api/users',
  settings: '/api/settings',
};
