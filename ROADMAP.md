# Roadmap

## Fase 0 — Fundación (en curso)

- [x] Scaffold Next.js 16 + TypeScript + Tailwind v4 + arquitectura Clean
- [x] Análisis exhaustivo de `huarique_backend` (`BACKEND_ANALISIS.md`)
- [x] Cliente API + React Query + tipos base alineados al backend real
- [x] Home: buscador + mapa + listado + filtros (con datos reales de `/places`)
- [x] Página de restaurante: detalle, carta digital, reviews, galería de fotos/videos
- [x] Auth: login, registro con verificación de email, sesión persistida vía cookie httpOnly + bootstrap al cargar la app. Falta login social y recuperación de contraseña (ver Fase 3.1)
- [x] Favoritos (funcional end-to-end una vez logueado)

## Fase 1 — Paridad con el spec de producto

- [x] Filtros avanzados completos (abierto ahora, precio, calificación mínima, amenities) — UI conectada a `/places`; falta confirmar con backend qué amenities están seedeadas
- [x] Reviews: crear, dar like, filtros (recientes/mejor/peor/con fotos) — filtros aplicados en cliente porque `GET /checkins/feed` no los soporta aún (ver TODO.md)
- [x] Distribución de calificaciones (gráfico 5★–1★) — mock client-side sobre las reviews cargadas, no el total real
- [x] Compartir (link, WhatsApp, Facebook, Instagram — Instagram cae a copiar enlace)
- [x] Modo oscuro / claro
- [x] Mobile: bottom navigation (Inicio/Favoritos/Perfil) con indicador animado (Framer Motion)

### Fase 1.1 — Pendiente

- [x] Forma real de `GET /places/:id/favorite` confirmada leyendo el backend: `{ isSaved: boolean }` (ya corregido en `favorites.service.ts`)
- [ ] Like/unlike de reviews: el feed no indica si el usuario actual ya dio like, así que hoy siempre se manda como "dar like"

## Fase 2 — Contenido enriquecido del restaurante

- [x] Promociones — **mock** (`services/mocks/restaurant-extended.mock.ts`), determinístico por `place.id`, hasta que exista backend
- [x] Perfil extendido: historia, especialidades, chef, premios, certificaciones — **mock**, hasta definir contrato de `Place.metadata`
- [x] Galería de fotos (reales, agregadas de las reviews/checkins) y videos (reales, `GET /places/:id/videos`)
- [x] Badge "Abierto ahora" / "Cerrado" — heurística best-effort sobre `openHoursText` (`utils/parseOpenHours.ts`), no reemplaza un horario estructurado real
- [x] Alérgenos / ingredientes / disponibilidad por plato — **mock** (`services/mocks/dish-extended.mock.ts`), hasta que se amplíe `Dish` en backend

### Fase 2.1 — Pendiente para reemplazar mocks por datos reales

- [ ] Reemplazar `restaurant-extended.mock.ts` en cuanto el backend defina el contrato de `Place.metadata` (historia, chef, premios, certificaciones) y exista un módulo de promociones.
- [ ] Reemplazar `dish-extended.mock.ts` cuando `Dish` incluya ingredientes/alérgenos/disponibilidad reales.
- [ ] Reemplazar `parseOpenHours.ts` cuando `Place` exponga `openingHours` estructurado — el parser actual solo toma el primer rango horario del texto y asume que aplica todos los días.

## Fase 3 — SEO, performance, accesibilidad, auth real

- [x] Metadata dinámica por restaurante (`generateMetadata`), Open Graph, Twitter Cards, `metadataBase`
- [x] JSON-LD (Schema.org `Restaurant`, `AggregateRating`) — `Review` individual no incluido todavía
- [x] `sitemap.ts` (estático + lugares reales de `/places`) + `robots.ts`, nativos de Next
- [x] Pasada de accesibilidad dirigida: aria-labels en botones icon-only, `role="dialog"` + Escape/clic-afuera en el panel de filtros, tabs con `role`/`aria-selected` en la galería, `aria-current` en bottom nav
- [x] Lazy loading + code splitting: `next/image` (lazy por defecto) + `dynamic(ssr:false)` para el mapa y el theme toggle
- [x] Auth real: login, registro + verificación de email, sesión persistida, interceptor 401 con refresh automático (`POST /auth/refresh`, corrigiendo el bug de `/auth/refresh-cookie`)

### Fase 3.1 — Pendiente

- [ ] Auditoría WCAG AA formal con herramientas automatizadas (axe/Lighthouse) — lo hecho fue una pasada manual dirigida, no una auditoría completa
- [ ] Recuperación de contraseña (`/auth/forgot-password` + `/auth/reset-password`)
- [ ] Login social (Google/Facebook/Instagram vía `/auth/social-login`)
- [ ] JSON-LD de `Review` individuales (actualmente solo `AggregateRating`)
- [ ] Probar el flujo de auth completo contra `huarique_backend` corriendo — se implementó leyendo el código fuente, no se verificó en runtime (requiere levantar Postgres + PostGIS)

## Fase 4 — Preparación para dashboard de administración

- [ ] Definir límite claro entre `wuarikes_web` (descubrimiento) y el panel de negocio (`/business/*` del backend) — probablemente proyecto/app separada
- [ ] Estructura de rutas/permisos reservada, sin construir funcionalidad todavía

## No planificado todavía

Reservas y delivery in-app no tienen endpoints en el backend actual; se documentan como huecos en `BACKEND_ANALISIS.md` pero no entran a este roadmap hasta que el backend los soporte.
