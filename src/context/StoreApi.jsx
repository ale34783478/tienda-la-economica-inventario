import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken, setToken, setUnauthorizedHandler } from '../services/api';
import * as inv from '../services/inventory';

const C = createContext();
const empty = { products: [], movements: [], users: [], settings: inv.defaultSettings };

// Misma interfaz que el modo demo (data, user, login, saveProduct, move…), pero los datos viven en el backend.
export function Store({ children }) {
  const [data, setData] = useState(empty);
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(() => !!getToken()); // hay token guardado: validarlo antes de mostrar nada
  const [notice, setNotice] = useState(null);
  const timer = useRef();
  const { pathname } = useLocation();

  const toast = (text, type = 'ok') => {
    clearTimeout(timer.current);
    setNotice({ text, type });
    timer.current = setTimeout(() => setNotice(null), 3000);
  };
  const reset = () => { setToken(null); setUser(null); setData(empty); };

  // Al abrir la app: si quedó una sesión en la pestaña, se valida con el servidor.
  useEffect(() => {
    setUnauthorizedHandler(() => { reset(); toast('Tu sesión expiró. Inicia sesión de nuevo.', 'error'); });
    if (!getToken()) return;
    let cancelled = false;
    (async () => {
      try {
        const u = await inv.me();
        const d = await inv.loadAll(u);
        if (!cancelled) { setUser(u); setData(d); }
      } catch { if (!cancelled) reset(); }
      finally { if (!cancelled) setBooting(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  // Al cambiar de pantalla se vuelven a pedir los datos (así se ven los cambios de otros usuarios).
  useEffect(() => {
    if (!user) return;
    inv.loadAll(user).then(setData).catch((e) => { if (e.status !== 401) toast(e.message, 'error'); });
  }, [pathname]);

  const api = useMemo(() => {
    const refresh = async () => { try { setData(await inv.loadAll(user)); } catch { /* se reintenta al cambiar de pantalla */ } };
    return {
      data, user, notice, toast, booting,
      login: async (name, pass) => {
        if (!name || !pass) throw Error('Ingresa tus credenciales.');
        const u = await inv.login(name.trim(), pass);
        try { const d = await inv.loadAll(u); setUser(u); setData(d); }
        catch (e) { setToken(null); throw e; }
      },
      logout: () => { inv.logout(); reset(); },
      saveProduct: async (p) => { const r = await inv.saveProduct(p); await refresh(); return r; },
      saveUser: async (u) => { const r = await inv.saveUser(u); await refresh(); return r; },
      move: async (m) => { const r = await inv.registerMovement(m); await refresh(); return r; },
      setSettings: async (s) => { const r = await inv.saveSettings(s); setData((d) => ({ ...d, settings: r })); return r; },
    };
  }, [data, user, notice, booting]);

  return <C.Provider value={api}>{children}</C.Provider>;
}

export const useStore = () => useContext(C);
