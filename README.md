# Tienda La Económica — Inventario

SPA React/Vite para el control académico de productos, existencias y movimientos. Usa Tailwind, React Router, React Hook Form + Zod, Lucide y jsPDF.

## Uso

`npm install` y después `npm run dev`. Inicia con **admin** o **encargado** y una contraseña de tres caracteres. La autenticación es una demostración, no seguridad de producción.

`npm run build` genera la compilación de producción. Vercel puede desplegarla como SPA gracias a `vercel.json`.

## Datos y C++

El modo predeterminado (`VITE_DATA_MODE=demo`) persiste datos en localStorage. Cambie a `api` y defina `VITE_API_BASE_URL` para un backend REST C++ con CORS habilitado. La capa central está en `src/services/api.js`; no hay llamadas HTTP dentro de páginas.

Contratos previstos: `GET/POST /api/products`, `PUT /api/products/:id`, `PATCH /api/products/:id/status`, `GET /api/inventory`, `GET/POST /api/inventory/movements`, `GET /api/reports/inventory`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`. Los productos usan JSON `{id,code,name,description,category,price,stock,minStock,active,date}`; los movimientos `{id,productId,type,quantity,reason,date,user}`. Respuestas de error recomendadas: `{message, code, details}`.
