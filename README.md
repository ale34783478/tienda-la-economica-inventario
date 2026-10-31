# Tienda La Económica — Frontend

React/Vite para inventario, conectado al backend Node.js en Render y PostgreSQL en Neon.

## Desarrollo

```sh
npm ci
npm run dev
```

Crear `.env.local` con `VITE_DATA_MODE=api` y `VITE_API_BASE_URL=http://localhost:8080`
para usar un backend local. `VITE_DATA_MODE=demo` activa datos de ejemplo en el navegador.

## Producción

El archivo `.env.production` contiene únicamente la URL pública de Render y el modo API.
Vercel: preset Vite, build `npm run build`, output `dist`.
Si existen variables del mismo nombre en Vercel, deben coincidir con ese archivo porque
las variables del entorno de compilación tienen prioridad.

Backend: https://github.com/ale34783478/tienda-la-economica-backend

No incluir DATABASE_URL, JWT_SECRET ni contraseñas en este repositorio o en variables VITE_*.
Los usuarios, productos y movimientos se guardan en el backend, no en localStorage.

## Permisos

- Superadministrador: administra todas las cuentas y ve la columna Cuenta.
- Administrador: edita únicamente Encargados; no ve la columna Cuenta.
- Encargado: no ve ni accede a Reportes, Usuarios o Configuración.
- Usuarios muestra Activo en verde e Inactivo en rojo.

```sh
npm run build
```
