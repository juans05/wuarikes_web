# API Integration — mapeo feature → endpoint

Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api`). Cliente en `src/api/client.ts`, servicios agrupados por dominio en `src/services/*.service.ts`, consumidos vía hooks de React Query en `src/hooks/*`.

| Feature del frontend | Endpoint(s) backend | Servicio/hook | Estado |
|---|---|---|---|
| Listado + búsqueda + filtros de restaurantes (Home, vista lista) | `GET /places` | `services/places.service.ts::getPlaces` → `usePlaces` | Real |
| Mapa interactivo (marcadores + "cerca de mí") | `GET /places` con `latitude/longitude/radius` | `usePlaces` | Real |
| Categorías (chips de filtro) | `GET /places/categories` | `useCategories` | Real |
| Amenities (Wifi, delivery, pet friendly, etc.) | `GET /places/amenities` | `useAmenities` | Real — confirmar seed con backend (ver BACKEND_ANALISIS.md) |
| "Algo diferente" / trending | `GET /places/discovery/different` | pendiente de servicio dedicado | Real, falta wiring en UI |
| Página de restaurante — detalle, contacto, servicios | `GET /places/:id` | `services/places.service.ts::getPlace` → `usePlace` | Real |
| Carta digital | `GET /places/:id/menu` | `getPlaceMenu` → `usePlaceMenu` | Real |
| Galería de fotos | — (agregadas de `GET /checkins/feed`) | `GallerySection.tsx` (reutiliza `useCheckinsFeed`) | Real, derivado de fotos de reviews (no hay galería propia del negocio en backend) |
| Galería de videos | `GET /places/:id/videos` | `services/videos.service.ts::getPlaceVideos` → `usePlaceVideos` | Real |
| Reviews del restaurante | `GET /checkins/feed?placeId=` | `services/checkins.service.ts::getCheckinsFeed` → `useCheckinsFeed` | Real, pero **sin** orden por rating ni filtro "con fotos" en backend — se aplican en cliente (`ReviewsSection.tsx`) |
| Crear review | `POST /checkins` | `useCreateCheckin` (`CreateReviewForm.tsx`) | Real, requiere sesión |
| Like a review | `POST/DELETE /checkins/:id/like` | `useLikeCheckin` | Real, requiere sesión. El feed no indica si el usuario ya dio like, así que siempre se manda como "dar like" |
| Distribución de calificaciones (gráfico 5★–1★) | — | `RatingBreakdown.tsx` | **MOCK** — se calcula client-side sobre las reviews cargadas en la página, no el total real, hasta que exista `GET /places/:id/rating-distribution` |
| Favoritos | `GET/POST/DELETE /places/:id/favorite` (`{ isSaved }`), `GET /users/me/favorites` | `services/favorites.service.ts`, `services/users.service.ts` → `useFavorite`, `FavoritesView.tsx` | Real, requiere sesión |
| Compartir (link, WhatsApp, Facebook, Instagram) | — | `utils/share.ts` + `ShareButtons.tsx` (Web Share API + intents) | No requiere backend |
| Login | `POST /auth/login` | `services/auth.service.ts::login` → `useLogin` (`LoginForm.tsx`) | Real |
| Registro + verificación de email | `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/resend-code` | `useRegister`/`useVerifyEmail`/`useResendCode` (`RegisterForm.tsx` + `VerifyEmailForm.tsx`) | Real — el registro no deja logueado hasta verificar el código de 6 dígitos |
| Logout | `POST /auth/logout` | `useLogout` | Real |
| Refresh automático de sesión | `POST /auth/refresh` (lee cookie, no `/auth/refresh-cookie` — ver BACKEND_ANALISIS.md) | interceptor en `src/api/client.ts` | Real — reintenta el request original una sola vez tras un 401 |
| Bootstrap de sesión al cargar la app | `GET /users/me/profile` | `AuthBootstrap.tsx` (montado en `Providers.tsx`) | Real — hidrata `useAuthStore` desde la cookie httpOnly si existe |
| Login social | `POST /auth/social-login` | — | Backend real disponible, **sin UI todavía** (falta SDK de Google/Facebook en el frontend) |
| Recuperación de contraseña | `POST /auth/forgot-password`, `POST /auth/reset-password` | — | Backend real disponible, **sin UI todavía** |
| Perfil de usuario | `GET /users/me/profile` | `services/users.service.ts::getMyProfile` → `useMyProfile` (`ProfileView.tsx`) | Real. Parcial — `reviewsCount/photosCount/videosCount` vienen en 0 desde backend |
| Selector de ubicación (departamento/provincia/distrito) | `GET /ubigeo/departments\|provinces\|districts` | pendiente | Real |
| Promociones en ficha de restaurante | — | `services/mocks/restaurant-extended.mock.ts::getMockPromotions` → `PromotionsSection.tsx` | **MOCK** — no existe endpoint, ver BACKEND_ANALISIS.md |
| Historia / especialidades / chef / premios / certificaciones | — | `services/mocks/restaurant-extended.mock.ts::getExtendedProfile` → `ExtendedProfileSection.tsx` | **MOCK** — `Place.metadata` existe pero sin contrato definido |
| Badge "Abierto ahora" / "Cerrado" | `Place.openHoursText` (texto libre) | `utils/parseOpenHours.ts` → `OpenNowBadge.tsx` | **Riesgo** — heurística best-effort: solo toma el primer rango horario y asume que aplica todos los días, hasta que el backend estructure el horario |
| Alérgenos / ingredientes / disponibilidad por plato | — | `services/mocks/dish-extended.mock.ts::getDishExtras` → `MenuSection.tsx` | **MOCK** — no existe en `Dish`, se muestra en la carta digital marcado como simulado hasta que exista |
| Gamification (nivel, badges, leaderboard) | `GET /gamification/*` | pendiente | `profile` y `leaderboard` son **mock del propio backend** |

## Autenticación

Estrategia: cookies httpOnly (`withCredentials: true` en `src/api/client.ts`), sin guardar tokens en `localStorage`. `useAuthStore` (Zustand) guarda solo `{ id, fullName, email, avatarUrl }` en memoria — se reconstruye en cada carga de página vía `AuthBootstrap`, nunca se persiste en el cliente.

Flujo: login/registro+verificación setean las cookies `accessToken`/`refreshToken` (las pone el backend). El interceptor de `apiClient` reintenta una vez con `POST /auth/refresh` ante un 401 en rutas no-`/auth/*`; si el refresh también falla, deslogea localmente. **No verificado contra un servidor corriendo** — implementado leyendo `auth.controller.ts`/`auth.service.ts`, confirmar con `huarique_backend` levantado antes de dar el flujo por cerrado (ver TODO.md).

## Reglas para features sin endpoint

Toda feature que use datos simulados debe:

1. Vivir detrás de un `services/*.service.ts` con la misma forma de retorno que tendría el endpoint real (para que el swap sea un cambio de una línea).
2. Marcar el archivo/función con un comentario `// MOCK:` explicando qué endpoint falta.
3. Tener su entrada correspondiente en `TODO.md`.
