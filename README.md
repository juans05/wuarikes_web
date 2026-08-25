# Wuarikes Web

Plataforma web de descubrimiento gastronómico de Perú (restaurantes, cafeterías, bares), inspirada en Google Maps, Yelp, TripAdvisor y Google Business Profile.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **TanStack React Query** — estado del servidor / cache de datos del backend
- **Axios** — cliente HTTP
- **Zustand** — estado de UI cliente (filtros, mapa, favoritos locales)
- **React Leaflet** — mapa interactivo
- **Framer Motion** — animaciones
- **React Hook Form + Zod** — formularios y validación
- **Lucide React** — iconos

## Arquitectura

Clean Architecture ligera dentro de `src/`:

```
src/
  api/          cliente HTTP base (axios)
  components/   componentes de UI reutilizables (ui/, common/)
  features/     features de dominio (home, restaurant, search, reviews, favorites)
  hooks/        hooks de React Query y lógica reutilizable
  layouts/      layouts compuestos (header, bottom nav, shells)
  services/     llamadas a la API del backend, agrupadas por dominio
  stores/       estado global cliente (Zustand)
  types/        tipos TypeScript compartidos, alineados a las entidades del backend
  utils/        utilidades puras
  styles/       estilos globales adicionales
  assets/       iconos e imágenes estáticas
```

Regla de dependencia: `features/*` puede usar `components/`, `hooks/`, `services/`, `stores/`, `types/`, `utils/`. `services/` solo habla con `api/`. Nada importa desde `app/` excepto las propias rutas.

## Backend

Consume `huarique_backend` (NestJS + TypeORM + PostgreSQL/PostGIS), prefijo `/api`. Ver análisis completo en [`BACKEND_ANALISIS.md`](./BACKEND_ANALISIS.md) y el mapeo endpoint → feature en [`API_INTEGRATION.md`](./API_INTEGRATION.md).

## Desarrollo

```bash
cp .env.example .env.local   # ajustar NEXT_PUBLIC_API_URL si el backend no corre en localhost:3001
npm install
npm run dev
```

Requiere que `huarique_backend` esté corriendo (`npm run start:dev` en ese proyecto) para datos reales; de lo contrario las features usan datos simulados marcados como `// MOCK:` (ver `TODO.md`).

## Documentación del proyecto

- [`BACKEND_ANALISIS.md`](./BACKEND_ANALISIS.md) — inventario completo de la API existente, bugs y huecos.
- [`API_INTEGRATION.md`](./API_INTEGRATION.md) — qué endpoint alimenta cada feature del frontend.
- [`ROADMAP.md`](./ROADMAP.md) — fases de construcción del producto.
- [`TODO.md`](./TODO.md) — pendientes concretos, incluyendo mocks a reemplazar cuando el backend los implemente.
