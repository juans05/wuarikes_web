# Análisis del Backend — huarique_backend

Análisis exhaustivo del backend NestJS (`D:\Github\wuarikes\huarique_backend`) para determinar qué puede reutilizar `wuarikes_web` y qué falta.

**Stack:** NestJS 10.3 · TypeORM (no Prisma) · PostgreSQL + PostGIS (columnas `geography` para geolocalización) · Swagger/OpenAPI activo (`@nestjs/swagger`, servido en `/api/docs` solo si `NODE_ENV !== 'production'`).

**Prefijo global:** `/api` (`app.setGlobalPrefix('api')` en `main.ts`). Todas las rutas de abajo van después de `/api`.

**Auth:** JWT (access 15 min + refresh 7 días), soportado por cookie httpOnly o body. Sin guard global — cada controller/método decide con `@UseGuards(JwtAuthGuard)`. Rate limiting global 30 req/min, más límites específicos en `/auth/*`.

**Separación arquitectónica:** hay una frontera clara entre endpoints de **descubrimiento** (`/places`, `/checkins`, `/users/me/*`, `/missions`, `/gamification`, `/ubigeo`, `/subscriptions`), que es lo que `wuarikes_web` debe consumir, y un **backoffice de negocio** (`/business/*`, `/admin/*`: WhatsApp/PlazBot, IA, redes sociales, fidelización, ads) que pertenece a otro panel (business/admin), no al sitio público.

---

## Endpoints existentes

### Auth — `/auth`

| Método | Ruta | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| POST | `/auth/register` | Registro (email+password+fullName) | Completo | Envía código de verificación |
| POST | `/auth/login` | Login email/password | Completo | Setea cookies httpOnly + devuelve tokens en body |
| POST | `/auth/verify-email` | Verificar email con código de 6 dígitos | Completo | |
| POST | `/auth/forgot-password` | Solicitar código de reset | Completo | |
| POST | `/auth/reset-password` | Reset de password con código | Completo | |
| POST | `/auth/resend-code` | Reenviar código de verificación | Completo | |
| POST | `/auth/social-login` | Login/registro Google/Facebook/Instagram | Completo | |
| POST | `/auth/refresh` | Refrescar tokens (lee la cookie `refreshToken`, no el body) | ⚠️ Bug confirmado | Ver "Bugs detectados" — `wuarikes_web` ya usa esta ruta |
| POST | `/auth/refresh-cookie` | Documentado en Swagger, pero la ruta **no existe** (404) | ⚠️ Bug confirmado | Ver "Bugs detectados" |
| POST | `/auth/logout` | Logout, invalida tokens y limpia cookies | Completo | Requiere JWT |

### Users — `/users` (todo requiere JWT)

| Método | Ruta | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| GET | `/users/me/profile` | Perfil propio (nivel, xp, stats, badges) | Parcial | `reviewsCount`, `photosCount`, `videosCount` hardcoded a 0 |
| PATCH | `/users/me/profile` | Actualizar perfil | Completo | |
| POST | `/users/me/avatar` | Subir avatar (máx 5MB) | Completo | Sube a Cloudinary |
| GET | `/users/me/checkins` | Check-ins propios (paginado) | Completo | |
| GET | `/users/me/followers` | Seguidores | Completo | |
| GET | `/users/me/following` | Seguidos | Completo | |
| GET | `/users/me/favorites` | Lugares favoritos | Completo | |

### Places (público) — `/places`

| Método | Ruta | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| GET | `/places` | Búsqueda/listado: `category`, `district`, `search`, `latitude/longitude/radius`, `priceMin/priceMax`, `minRating`, `amenities` (CSV), `openNow`, paginación | Completo | **Esta ruta cubre búsqueda + "nearby"** (no hay `/nearby` separado). `search` solo mira `name`/`description`, NO busca por plato |
| GET | `/places/categories` | Lista de categorías | Completo | |
| GET | `/places/amenities` | Lista de amenities | Completo | |
| GET | `/places/discovery/different` | "Algo diferente" (trending 7 días) | Completo | |
| GET | `/places/my-submissions` | Propuestas enviadas por el usuario | Completo | Requiere JWT |
| GET | `/places/:id` | Detalle completo (dishes, tags, amenities, distrito, categoría, owner) | Completo | No incluye reviews embebidas — pedir aparte a `/checkins/feed?placeId=` |
| GET | `/places/:id/menu` | Menú digital (categorías + platos) | Completo | |
| POST | `/places/submit` | Proponer nuevo lugar | Completo | Requiere JWT |
| POST | `/places/submissions` | Alias legacy de `/submit` | Duplicado | Requiere JWT |
| POST | `/places/:id/claim` | Reclamar lugar como dueño de negocio | Completo | Requiere JWT |
| GET | `/places/:id/favorite` | Verificar si está en favoritos — responde `{ isSaved: boolean }` | Completo | Requiere JWT |
| POST | `/places/:id/favorite` | Agregar a favoritos | Completo | Requiere JWT |
| DELETE | `/places/:id/favorite` | Quitar de favoritos | Completo | Requiere JWT |
| GET | `/places/:id/videos` | Videos del lugar (paginado) | Completo | |
| POST | `/places/:id/videos` | Subir video (máx 20MB) | Completo | Requiere JWT, dueño |

### Checkins / Reviews — `/checkins`

| Método | Ruta | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| POST | `/checkins` | Crear check-in (= review: `rating` 1-5, `comment`, `photoUrl`/`photos[]`) | Completo | Requiere JWT. Actualiza rating promedio y otorga puntos |
| GET | `/checkins/feed` | Feed global/por lugar (`placeId`, `district`, paginado) | Parcial | Solo orden cronológico DESC — no soporta ordenar por rating ni filtrar "solo con fotos" |
| POST | `/checkins/:id/like` | Dar like | Completo | Requiere JWT |
| DELETE | `/checkins/:id/like` | Quitar like | Completo | Requiere JWT |

> No existe una entidad `Review` dedicada: las reseñas de usuarios **son los Checkins** (rating + comment + fotos). Son distintas de `GoogleReview` (sincronizadas desde Google) y de `PublicFeedback` (feedback privado vía NFC/QR).

### Gamification — `/gamification` (requiere JWT)

| Método | Ruta | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| GET | `/gamification/my-stats` | Stats de gamificación | Completo | |
| GET | `/gamification/badges` | Badges + estado de desbloqueo | Completo | |
| GET | `/gamification/badges/:id` | Detalle de badge | Completo | |
| GET | `/gamification/profile` | Nivel, XP, progreso | ⚠️ Mock | Respuesta simulada, comentario explícito en código |
| GET | `/gamification/leaderboard` | Top 10 usuarios | ⚠️ Mock | Array hardcoded, no consulta BD |

### Missions — `/missions` (requiere JWT)

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/missions` | Lista de misiones del usuario | Completo |
| GET | `/missions/daily` | Misiones diarias + progreso | Completo |
| POST | `/missions/:id/claim` | Reclamar recompensa | Completo |

### Ubigeo (público) — `/ubigeo`

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/ubigeo/departments` | Departamentos | Completo |
| GET | `/ubigeo/provinces?department=` | Provincias | Completo |
| GET | `/ubigeo/districts?department=&province=` | Distritos con coordenadas | Completo (tiene un `console.log` de debug) |

### Subscriptions — `/subscriptions`

| Método | Ruta | Descripción | Estado | Observaciones |
|---|---|---|---|---|
| GET | `/subscriptions/plans` | Planes disponibles | Completo | Público |
| POST | `/subscriptions/subscribe` | Suscribirse | Completo | Requiere JWT |
| GET | `/subscriptions/my` | Suscripción propia | Completo | Requiere JWT |
| GET | `/subscriptions/my/payments` | Pagos propios | Completo | Requiere JWT |
| DELETE | `/subscriptions/my` | Cancelar suscripción | Completo | Requiere JWT |
| GET | `/subscriptions/admin/all` | Todas las suscripciones | Completo | JWT + admin |
| GET | `/subscriptions/admin/stats` | Estadísticas de ingresos | Completo | JWT + admin |

### Upload — `/upload`

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| POST | `/upload/image` | Subir imagen a Cloudinary (máx 5MB) | Completo — requiere JWT |

### Fuera de alcance para wuarikes_web (backoffice)

No se detalla ruta por ruta porque pertenecen a otro frontend (panel de negocio / admin), pero existen y están completos: `/admin/*` (moderación, submissions, claims, stats, usuarios), `/business/*` (onboarding, perfil de negocio, CRUD de menú duplicado del público, sync de Google, WhatsApp/PlazBot, IA, redes sociales, fidelización, créditos, campañas de email, meta ads, dispositivos NFC).

---

## Bugs / inconsistencias detectadas

| Ubicación | Problema |
|---|---|
| `auth.controller.ts` | **Confirmado leyendo el código** (no solo sospecha): `refreshFromCookie` está decorado con `@Post('refresh')` *y* `@Post('refresh-cookie')` a la vez — como los decoradores se aplican de abajo hacia arriba, `@Post('refresh')` (el de más arriba) sobrescribe la metadata y gana. Resultado: `POST /auth/refresh-cookie` no existe (404), y tanto `refreshFromCookie` (cookie) como el método `refresh` (body, `RefreshTokenDto`) quedan registrados en `POST /auth/refresh` — Express resuelve al primero declarado en la clase (`refreshFromCookie`, el que lee la cookie), dejando el flujo por body como código muerto inalcanzable. `wuarikes_web` ya integra el refresh automático contra `POST /auth/refresh` sin body (ver `src/api/client.ts`), asumiendo que la cookie `refreshToken` resuelve. **No verificado contra un servidor corriendo** (requiere Postgres+PostGIS) — confirmar con una petición real antes de confiar del todo. |
| `auth.service.ts::verifyEmail` | `return { user: { ...user, isVerified: true }, ...tokens }` spreadea la entidad `User` completa, lo que probablemente incluye `passwordHash` en la respuesta de `POST /auth/verify-email`. Revisar y devolver un DTO explícito. |
| `documents.controller.ts` (`/documents`) | Sin `@UseGuards(JwtAuthGuard)`, usa `req.user?.id` que siempre es `undefined` → lanza error 500 genérico en vez de 401. Módulo roto, no usar todavía. |
| `gamification.controller.ts` | `/gamification/profile` y `/gamification/leaderboard` devuelven datos mock. |
| `users.service.ts::getProfile` | `reviewsCount`, `photosCount`, `videosCount` siempre en 0. |
| `social.controller.ts::replyToComment` | TODO explícito: la respuesta no se publica en Instagram real todavía (fuera de alcance de wuarikes_web igualmente). |
| `ubigeo.controller.ts`, `whatsapp-numbers.controller.ts`, `ai-agent.controller.ts` | `console.log` de debug en producción. |

---

## Modelos de datos principales

- **User**: `id, email, fullName, avatarUrl, bio, pronouns, gender, birthDate, role (user\|admin\|business), totalPoints, currentLevel, isVerified, isBanned`.
- **Place**: `id, name, description, categoryId, districtId, address, latitude/longitude (+ geography Point), phone, website, coverImageUrl, status, isVerified, rarity, rating, totalReviews, googlePlaceId/googleRating, slug, claimedByUserId, averagePrice/priceMin/priceMax, openHoursText (texto libre), metadata (jsonb sin schema), views`. Relaciones: tags, amenities (M2M), dishes, videos, checkins.
- **Category**: `id, name, slug, icon`.
- **Amenity**: `id, name, slug, iconUrl` (delivery, wifi, pet friendly, etc. — confirmar seed real con backend).
- **Dish**: `id, name, description, price, imageUrl, displayOrder, placeId, categoryId→MenuCategory`. **No tiene** disponibilidad, ingredientes ni alérgenos.
- **MenuCategory**: `id, name, description, displayOrder, placeId`.
- **Checkin** (= review): `id, userId, placeId, comment (≤200), rating (1-5), photoUrl, likesCount, createdAt`. Relaciones: `CheckinPhoto`, `CheckinLike`.
- **FavoritePlace**: `id, userId, placeId, createdAt`.
- **PlaceVideo**: `id, url, thumbnailUrl, duration, viewCount, placeId, userId`.
- **GoogleReview**: reseñas sincronizadas desde Google Maps (`authorName`, `rating`, `text`, `time`, etc.).
- **PlaceSubmission** / **PlaceClaim**: propuestas de lugar y reclamos de negocio pendientes de aprobación.
- **Badge / UserBadge / Mission / UserMission / UserPointsLog / UserStreak**: gamificación.
- **Subscription / Payment**: planes de suscripción del negocio.
- **Ubigeo**: división política de Perú (department, province, district, lat/lng).

---

## Endpoints faltantes / recomendados

| Método + ruta propuesta | Justificación |
|---|---|
| `GET /places?search=` extendido a `dishes.name` | Hoy `search` solo mira `name`/`description` del lugar; falta cubrir "buscar por plato". |
| `GET /checkins/feed?sort=recent\|top_rated\|low_rated\|most_liked&hasPhotos=true` | El feed solo ordena por fecha; el requisito pide más recientes / mejor / menor puntuación / con fotos. |
| `POST /checkins/:id/reply` (dueño del lugar) | No existe respuesta del negocio a una reseña pública (sí existe para comentarios de Instagram). |
| `GET /places/:id/rating-distribution` | No hay endpoint agregado de distribución por estrellas; hoy tocaría calcularlo en el cliente descargando todos los checkins. |
| `GET /places/nearby?lat=&lng=&radius=` (alias) | Funcionalmente ya cubierto por `GET /places` con lat/lng, pero un alias explícito mejora claridad para el frontend. |
| Promociones: `GET /places/:id/promotions` | No existe módulo/entidad de promociones visibles en la ficha del lugar (solo email-campaigns como canal interno). |
| Perfil extendido del restaurante (historia, especialidades, chef, premios, certificaciones) | `Place` no tiene estos campos; solo `description` libre y `metadata` jsonb sin contrato. |
| Horario estructurado `openingHours: {day, open, close}[]` | `openHoursText` es texto libre parseado con regex frágil — bloquea un filtro "abierto ahora" confiable. |
| Alérgenos / ingredientes / disponibilidad en `Dish` | Pedido explícito del spec de producto; el modelo actual no los contempla. |
| `GET /gamification/leaderboard` real | Hoy devuelve mock hardcoded. |
| Confirmar seed real de `Amenity` | El mecanismo de filtro por amenities (`?amenities=slug1,slug2`) ya existe, pero hay que confirmar con backend cuáles amenities están cargadas (pet friendly, wifi, terraza, romántico, familiar, etc. del spec). |

---

## Qué usa wuarikes_web desde el día 1

`/places`, `/places/categories`, `/places/amenities`, `/places/:id`, `/places/:id/menu`, `/places/:id/videos`, `/places/discovery/different`, `/checkins/feed`, `/checkins`, `/checkins/:id/like`, `/places/:id/favorite`, `/users/me/*`, `/auth/*`, `/ubigeo/*`.

Todo lo que aparece en "Endpoints faltantes" arriba se implementa con **datos simulados (mock)**, claramente marcados en el código (`// MOCK:` o carpeta `src/mocks`) hasta que el backend los exponga. Ver `API_INTEGRATION.md` para el mapeo endpoint → feature del frontend.
