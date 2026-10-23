// Único punto de acceso: cambie VITE_DATA_MODE=api y configure VITE_API_BASE_URL al conectar C++.
const BASE=import.meta.env.VITE_API_BASE_URL||''; const mode=import.meta.env.VITE_DATA_MODE||'demo';
export async function request(path, options={}){if(mode==='demo') throw new Error('El adaptador demo se usa desde el contexto.'); const r=await fetch(`${BASE}${path}`,{headers:{'Content-Type':'application/json'},...options}); if(!r.ok) throw new Error((await r.json().catch(()=>({}))).message||'Error de API'); return r.status===204?null:r.json()}
export const endpoints={products:'/api/products',inventory:'/api/inventory',movements:'/api/inventory/movements',login:'/api/auth/login',reports:'/api/reports/inventory'};
