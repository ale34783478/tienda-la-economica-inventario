import { request, setToken, endpoints } from './api.js';

export const defaultSettings = {
  businessName: 'Tienda La Económica', currency: 'GTQ', dateFormat: 'DD/MM/YYYY',
  defaultMinStock: 10, reportInfo: 'Inventario y suministros generales',
};
const ADMIN_ROLES = ['Superadministrador', 'Administrador'];

export async function login(username, password) {
  const r = await request(endpoints.login, { method: 'POST', body: { username, password }, auth: false });
  setToken(r.token);
  return r.user;
}
export const me = () => request('/api/auth/me');
export async function logout() {
  try { await request('/api/auth/logout', { method: 'POST', quiet: true }); } catch { /* la sesión local se cierra igual */ }
  setToken(null);
}

// Descarga todo lo que necesitan las pantallas. Los Encargados no pueden listar usuarios: ven solo su cuenta.
export async function loadAll(user) {
  const [products, movements, settings, users] = await Promise.all([
    request(endpoints.products),
    request(`${endpoints.movements}?limit=1000`),
    request(endpoints.settings),
    ADMIN_ROLES.includes(user.role) ? request(endpoints.users) : Promise.resolve([user]),
  ]);
  return { products, movements, settings: { ...defaultSettings, ...settings }, users };
}

export function saveProduct(p) {
  const body = {
    code: p.code, name: p.name, category: p.category, description: p.description ?? '',
    price: p.price, stock: p.stock, minStock: p.minStock,
    ...(p.id && typeof p.active === 'boolean' && { active: p.active }),
  };
  return p.id
    ? request(`${endpoints.products}/${p.id}`, { method: 'PUT', body })
    : request(endpoints.products, { method: 'POST', body });
}

export function registerMovement(m) {
  return request(endpoints.movements, {
    method: 'POST',
    body: {
      productId: m.productId, type: m.type, quantity: m.quantity, reason: m.reason,
      ...(m.type === 'Ajuste' && { targetStock: m.targetStock ?? m.quantity }), // en un ajuste se envía la existencia final
    },
  });
}

export function saveUser(u) {
  const body = { name: u.name, username: u.username, role: u.role, active: u.active, ...(u.password && { password: u.password }) };
  return u.id ? request(`${endpoints.users}/${u.id}`, { method: 'PUT', body }) : request(endpoints.users, { method: 'POST', body });
}

export const saveSettings = (s) => request(endpoints.settings, { method: 'PUT', body: s });
