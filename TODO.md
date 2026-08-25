# TODO

## Bloqueadores de backend (coordinar con equipo de `huarique_backend`)

- [x] Confirmar cuál de `POST /auth/refresh` / `POST /auth/refresh-cookie` responde realmente — **confirmado leyendo el código fuente** (no en runtime): `refresh-cookie` no existe, `refresh` resuelve al handler basado en cookie. Ver BACKEND_ANALISIS.md → "Bugs detectados". Falta verificar contra un servidor corriendo.
- [ ] Confirmar seed real de `Amenity` en BD (delivery, pet friendly, wifi, estacionamiento, accesible, acepta tarjetas, reservas, terraza, familiar, romántico) antes de construir los chips de filtro.
- [ ] `GET /gamification/profile` y `GET /gamification/leaderboard` son mock en el backend — no integrar hasta que devuelvan datos reales.
- [ ] `reviewsCount/photosCount/videosCount` en `GET /users/me/profile` siempre vienen en 0.
- [ ] Pedir acceso a `/api/docs` (Swagger) en un entorno no-productivo, o el JSON exportado, para trabajar contra la spec exacta — o levantar `huarique_backend` localmente (requiere Postgres + PostGIS vía `docker-compose.yml`) para probar el flujo de auth real contra un servidor vivo.
- [ ] `POST /auth/verify-email` probablemente filtra `passwordHash` en la respuesta (`auth.service.ts::verifyEmail` spreadea la entidad `User` completa) — pedir que se acote a un DTO explícito.

## Endpoints a solicitar (ver detalle y justificación en BACKEND_ANALISIS.md)

- [ ] `search` en `GET /places` extendido a nombre de plato.
- [ ] `GET /checkins/feed` con `sort=` (recientes/mejor/peor/más likeado) y `hasPhotos=`.
- [ ] `POST /checkins/:id/reply` — respuesta del negocio a una review pública.
- [ ] `GET /places/:id/rating-distribution`.
- [ ] Endpoint o contrato de `metadata` para: promociones, historia, especialidades, chef, premios, certificaciones.
- [ ] Horario estructurado (`openingHours[]`) en `Place`.
- [ ] Alérgenos / ingredientes / disponibilidad en `Dish`.

## Frontend — hecho

- [x] Home: buscador, mapa, listado, filtros avanzados, panel de filtros con cierre por Escape/clic afuera.
- [x] Página `/restaurantes/[id]`: detalle, carta digital, galería (fotos reales + videos reales), reviews, promociones (mock), perfil extendido (mock), badge de horario.
- [x] Reseñas: listar, crear, dar like, filtros client-side, distribución de calificaciones (mock).
- [x] Compartir, modo oscuro/claro, bottom navigation.
- [x] Favoritos: botón + página `/favoritos`, usando la forma real `{ isSaved }` de `GET /places/:id/favorite`.
- [x] **Auth real**: `/login`, `/registro` (con paso de verificación de email inline), `useAuthStore` alimentado por respuestas reales de `/auth/login` y `/auth/verify-email`.
- [x] Session bootstrap: `AuthBootstrap` intenta `GET /users/me/profile` al montar la app para hidratar la sesión desde la cookie httpOnly existente.
- [x] Interceptor 401 con reintento real: al recibir 401 en una ruta no-auth, intenta `POST /auth/refresh` una vez (dedupeando llamadas concurrentes) y reintenta el request original; si falla, deslogea.
- [x] `ProfileView` real: avatar, nombre, nivel, puntos, check-ins, badges (`GET /users/me/profile`) + botón de logout.
- [x] SEO: `generateMetadata` dinámico + JSON-LD (`Restaurant`, `AggregateRating`) en `/restaurantes/[id]`, `metadataBase`, `sitemap.ts` (estático + lugares reales) y `robots.ts` nativos de Next.
- [x] Pasada de accesibilidad: `aria-label`/`aria-pressed` en botones icon-only, `role="dialog"` + cierre por Escape/clic afuera en el panel de filtros, `role="tablist"/"tab"/"tabpanel"` en la galería, `aria-current="page"` en el bottom nav, `aria-label` en el buscador.

## Frontend — próximos pasos concretos

- [ ] Probar el flujo de auth real contra `huarique_backend` corriendo (login, registro + verificación, refresh, logout) — todo lo de arriba se implementó leyendo el código fuente del backend, no se pudo probar en runtime en esta sesión.
- [ ] Recuperación de contraseña (`/auth/forgot-password` + `/auth/reset-password`) — no se construyó UI todavía.
- [ ] Login social (`/auth/social-login`) — el backend lo soporta, falta UI/SDK de Google/Facebook en el frontend.
- [ ] Store de Zustand para filtros de Home si el estado local (`useState` en `HomeView`) se vuelve difícil de compartir entre componentes (hoy es suficiente, no crear el store antes de necesitarlo).
- [ ] `parseOpenHours.ts` es una heurística: solo toma el primer rango horario del texto libre y asume que aplica todos los días — reemplazar en cuanto exista `openingHours` estructurado en el backend.
- [ ] Auditoría de accesibilidad más profunda con herramientas automatizadas (axe/Lighthouse) — la pasada de esta iteración fue manual y dirigida a los componentes interactivos más obvios (paneles flotantes, tabs, botones icon-only), no un audit WCAG AA completo.

## Housekeeping

- [x] Configurar `next.config.ts` con dominios de imágenes remotas (Cloudinary) para `next/image`.
- [x] `sitemap.ts`/`robots.ts` nativos de Next (sin `next-sitemap`, YAGNI sobre dependencias).
