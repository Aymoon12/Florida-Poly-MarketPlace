# Florida Poly MarketPlace

A university marketplace where Florida Polytechnic students buy and sell items — textbooks, electronics, dorm goods, and more. Access is gated behind Florida Poly Azure AD accounts, so every buyer and seller is a verified student.

**Stack:** Spring Boot 3.4 / Java 21 REST API + React 19 / TypeScript SPA, backed by PostgreSQL (Supabase), AWS S3 for images, and STOMP-over-WebSocket for real-time chat.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [WebSocket API](#websocket-api)
- [Authentication Flow](#authentication-flow)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

---

## Features

| Feature | Status | Notes |
|---|---|---|
| Azure AD (Entra ID) login | ✅ | OAuth2 login, JWT issued on success |
| Item listings | ✅ | Create, delete, browse, filter by category |
| Search | ✅ | Keyword search across active listings |
| Shopping cart | ✅ | Add, update quantity, remove, clear |
| Real-time chat | ✅ | STOMP over SockJS, per-conversation threads |
| Notifications | ✅ | In-app feed, unread counts, mark-as-read |
| Reviews & ratings | ✅ | Buyer and seller reviews with rating summaries |
| Sales tracking | ✅ | Mark as sold, pick buyer, post-sale review prompts |
| Saved items / watchlist | ✅ | Save, unsave, watcher counts |
| View history | ✅ | Recently viewed items |
| Image uploads | ✅ | S3 presigned URLs, 10 MB per file / 50 MB per request |
| Dark mode | ✅ | MUI theme switching |
| Payments | 🚧 | `PaymentController` (`api/v1/stripe`) is a stub |

**Categories:** `ELECTRONICS`, `BOOKS`, `COLLECTIBLES`, `FASHION`, `SPORTS`, `SERVICES`, `OTHER`

**Listing statuses:** `ACTIVE`, `SOLD`, `INACTIVE`

---

## Tech Stack

### Backend (`/src`)

| Concern | Choice |
|---|---|
| Framework | Spring Boot 3.4.3 |
| Language | Java 21 |
| Build | Maven (wrapper included) |
| Database | PostgreSQL (Supabase-hosted) |
| ORM | Spring Data JPA / Hibernate (`ddl-auto: update`) |
| Auth | Azure AD OAuth2 + JWT (jjwt 0.12.6) |
| Storage | AWS S3 (presigned URLs) |
| Cache | Caffeine |
| Realtime | Spring WebSocket + STOMP |
| Email | Courier |

### Frontend (`/fronten`)

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite 6.2 |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS 4.0 + MUI 6.4 |
| Routing | React Router DOM 7.2 |
| HTTP | Axios 1.8 |
| Realtime | `@stomp/stompjs` + `sockjs-client` |
| Animation | Framer Motion 12.5 |
| Dates | date-fns 4.1 |

> **Note on the directory name:** the frontend lives in `fronten/` (missing the trailing `d`). It is spelled that way throughout this branch — don't rename it without updating imports and build scripts.

---

## Architecture

```
┌──────────────────┐        REST (axios)         ┌────────────────────┐
│  React SPA       │ ──────────────────────────► │  Spring Boot API   │
│  localhost:5173  │ ◄────────────────────────── │  localhost:8080    │
│                  │                             │                    │
│  STOMP/SockJS    │ ◄───────  /ws  ───────────► │  WebSocket broker  │
└──────────────────┘                             └─────────┬──────────┘
                                                           │
                          ┌────────────────────────────────┼──────────────┐
                          ▼                                ▼              ▼
                  ┌───────────────┐              ┌─────────────┐  ┌──────────────┐
                  │  Azure AD     │              │  PostgreSQL │  │   AWS S3     │
                  │  (OAuth2)     │              │  (Supabase) │  │  (images)    │
                  └───────────────┘              └─────────────┘  └──────────────┘
```

**Layering (backend):** `controllers` → `services` → `repository` → `entities`, with `dto`/`requests` at the API boundary and `exception/GlobalExceptionHandler` normalizing errors.

**Frontend conventions:** page components live at `fronten/src/*.tsx`; reusable pieces in `components/`; `services/` wraps chat, reviews, sales, and the WebSocket client. There is **no centralized API layer** — most pages call axios directly against `http://localhost:8080`.

### Ports

| Service | Port |
|---|---|
| Spring Boot API | 8080 |
| Vite dev server | 5173 |

There is **no Vite proxy** configured. The frontend calls the backend's absolute URL, and CORS is handled by `@CrossOrigin` on the controllers plus the CORS config in `SecurityConfiguration`.

---

## Prerequisites

- **JDK 21** (`java -version` should report 21.x)
- **Node.js 18+** and npm
- **PostgreSQL database** — a Supabase project is the expected setup
- **Azure AD app registration** with a client secret and the redirect URI configured
- **AWS account** with an S3 bucket and an IAM user scoped to that bucket

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Aymoon12/Florida-Poly-MarketPlace.git
cd Florida-Poly-MarketPlace
```

### 2. Configure the backend

`src/main/resources/application.yaml` is **git-ignored** because it holds environment-specific config. Create it from the committed template:

```bash
cp src/main/resources/application.yaml.example src/main/resources/application.yaml
```

The template reads every secret from an environment variable, so you don't edit the YAML — you supply the variables. Create your `.env`:

```bash
cp .env.example .env
```

Then fill in `.env` with your real values (see [Configuration](#configuration)). `.env` is git-ignored and must stay that way.

### 3. Run the backend

```bash
# Windows (PowerShell)
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. Hibernate creates and updates tables automatically on first run (`ddl-auto: update`).

> Spring Boot does not read `.env` on its own. Either export the variables into your shell before running, set them in your IDE run configuration, or add a dotenv loader. In PowerShell:
>
> ```powershell
> Get-Content .env | Where-Object { $_ -match '^\s*[A-Z]' } | ForEach-Object {
>   $k, $v = $_ -split '=', 2
>   [Environment]::SetEnvironmentVariable($k, $v)
> }
> ```

### 4. Run the frontend

```bash
cd fronten
npm install
npm run dev
```

The SPA starts on `http://localhost:5173`.

### Build commands

| Command | What it does |
|---|---|
| `./mvnw clean install` | Compile, test, and package the backend |
| `./mvnw spring-boot:run` | Run the API in dev mode |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build locally |

---

## Configuration

All backend secrets come from environment variables. Copy `.env.example` to `.env` and fill in:

| Variable | Description | Where to find it |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile (`dev` / `prod`) | — |
| `AZURE_TENANT_ID` | Azure AD tenant (directory) ID | Azure Portal → App registrations → Overview |
| `AZURE_CLIENT_ID` | Application (client) ID | Same page |
| `AZURE_CLIENT_SECRET` | Client secret value | App registrations → Certificates & secrets |
| `DATABASE_URL` | JDBC URL, e.g. `jdbc:postgresql://host:5432/postgres` | Supabase → Project Settings → Database |
| `DATABASE_USERNAME` | Database user | Same page |
| `DATABASE_PASSWORD` | Database password | Same page |
| `JWT_SECRET` | Base64 256-bit signing key — generate with `openssl rand -base64 32` | Generate yourself |
| `AWS_ACCESS_KEY` | IAM access key ID | AWS IAM → Users → Security credentials |
| `AWS_SECRET_KEY` | IAM secret access key | Shown once at key creation |
| `AWS_S3_BUCKET` | S3 bucket name for listing images | AWS S3 console |
| `FRONTEND_URL` | Frontend origin for CORS and the OAuth redirect | `http://localhost:5173` in dev |

### Non-secret defaults (set in `application.yaml`)

| Setting | Value |
|---|---|
| `spring.jpa.hibernate.ddl-auto` | `update` |
| `jwt.expiration` | `86400000` ms (24 h) |
| `aws.s3.presigned-url.expiry` | `900000` ms (15 min) |
| `spring.servlet.multipart.max-file-size` | `10MB` |
| `spring.servlet.multipart.max-request-size` | `50MB` |

---

## API Reference

Base path: `http://localhost:8080`. All routes require a `Bearer` JWT unless noted.

### Items — `api/v1/item`

| Method | Path | Description |
|---|---|---|
| `POST` | `/createListing` | Create a listing |
| `DELETE` | `/deleteListing` | Delete a listing |
| `GET` | `/getAllActiveListings` | All `ACTIVE` listings |
| `GET` | `/search` | Keyword search |
| `GET` | `/getAllListingsByCategory` | Filter by category |
| `GET` | `/{itemId}/{userId}` | Item detail (records a view) |
| `GET` | `/getHistory` | Caller's view history |
| `GET` | `/getRecentlyViewed` | Recently viewed items |
| `POST` | `/decrementWatchers/{itemId}` | Decrement watcher count |

### Cart — `api/v1/cart`

| Method | Path | Description |
|---|---|---|
| `POST` | `/add` | Add an item |
| `PUT` | `/{cartItemId}` | Update quantity |
| `DELETE` | `/{cartItemId}` | Remove an item |
| `DELETE` | `/clear` | Empty the cart |
| `GET` | `/count` | Item count badge |

### Chat — `/api/v1/chat`

| Method | Path | Description |
|---|---|---|
| `GET` | `/conversations` | Caller's conversations |
| `GET` | `/conversation/{conversationId}` | One conversation |
| `GET` | `/messages/{conversationId}` | Message history |
| `POST` | `/start` | Start a conversation |
| `POST` | `/send` | Send a message (REST fallback) |
| `POST` | `/mark-read/{conversationId}` | Mark thread read |
| `GET` | `/unread-count` | Unread badge count |

### Reviews — `api/v1/reviews`

| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Submit a review |
| `GET` | `/can-review` | Eligibility check |
| `GET` | `/seller/{sellerId}` | Reviews of a seller |
| `GET` | `/seller/{sellerId}/summary` | Seller rating summary |
| `GET` | `/buyer/{buyerId}` | Reviews of a buyer |
| `GET` | `/buyer/{buyerId}/summary` | Buyer rating summary |
| `GET` | `/item/{itemId}` | Reviews for an item |
| `GET` | `/item/{itemId}/summary` | Item rating summary |
| `GET` | `/user/{userId}/given` | Reviews written by a user |
| `DELETE` | `/{reviewId}` | Delete a review |

### Sales — `api/v1/sale`

| Method | Path | Description |
|---|---|---|
| `POST` | `/itemSold` | Record a sale |
| `POST` | `/mark-as-sold` | Mark listing sold and assign a buyer |
| `GET` | `/potential-buyers` | Buyers who messaged about the item |
| `GET` | `/user-sales` | Caller's sales |
| `GET` | `/pending-reviews` | Sales awaiting a review |

### Saved listings — `api/v1/saved`

| Method | Path | Description |
|---|---|---|
| `POST` | `/save` | Save an item |
| `DELETE` | `/unsave` | Unsave an item |
| `GET` | `/getAllSaved` | All saved items |
| `GET` | `/last-five` | Five most recent saves |
| `GET` | `/check` | Is a given item saved? |

### Notifications — `api/v1/notifications`

| Method | Path | Description |
|---|---|---|
| `GET` | `/user/{userId}` | All notifications |
| `GET` | `/user/{userId}/paginated` | Paged notifications |
| `GET` | `/user/{userId}/unread` | Unread only |
| `GET` | `/user/{userId}/unread/count` | Unread count |
| `GET` | `/user/{userId}/type/{type}` | Filter by type |
| `PUT` | `/{notificationId}/read` | Mark one read |
| `PUT` | `/user/{userId}/read-all` | Mark all read |
| `DELETE` | `/{notificationId}` | Delete one |

### Images — `api/v1/images`

| Method | Path | Description |
|---|---|---|
| `GET` | `/upload-url` | Get an S3 presigned upload URL |
| `POST` | `/upload` | Direct upload via the API |
| `GET` | `/{itemId}` | Image URLs for an item |
| `DELETE` | `/{itemId}` | Delete an item's images |

### Other

| Method | Path | Description |
|---|---|---|
| `GET` | `api/v1/user/dashboardstats` | Dashboard aggregates |
| `GET` | `api/v1/settings/user/{userId}` | User settings |
| `POST` | `api/v1/settings/user/{userId}/reset` | Reset settings to defaults |
| — | `api/v1/stripe` | Payments (stub) |
| — | `api/v1/dev/**` | **Dev-only test login** — see [Security Notes](#security-notes) |

---

## WebSocket API

- **Endpoint:** `ws://localhost:8080/ws` (SockJS)
- **Allowed origins:** `http://localhost:5173`, `http://localhost:3000`
- **App destination prefix:** `/app`
- **Broker prefixes:** `/topic`, `/queue`

| Destination | Direction | Purpose |
|---|---|---|
| `/app/chat.send` | client → server | Send a chat message |
| `/app/chat.markRead` | client → server | Mark a conversation read |

Connections are authenticated by `WebSocketAuthChannelInterceptor`, which reads the JWT from the STOMP `CONNECT` headers. Client-side wiring lives in `fronten/src/services/WebSocketService.ts` and `fronten/src/hooks/useWebSocket.ts`.

---

## Authentication Flow

1. The user clicks login; the browser is sent to the Azure AD authorization endpoint.
2. Azure AD authenticates the Florida Poly account and redirects back to the API.
3. `CustomOAuth2SuccessHandler` finds or creates the `User`, signs a JWT, and redirects to the frontend with `userId`, `token`, and `name` as query parameters.
4. The SPA stores those in `localStorage` and attaches `Authorization: Bearer <token>` to subsequent requests.
5. `JwtAuthenticationFilter` validates the token on every request. `SecurityConfiguration` requires authentication for everything except `/api/v1/auth/**`, `/api/v1/s3/**`, `/ws/**`, `/login/**`, `/api/v1/oauth/**`, and `/api/v1/dev/**`.

Tokens are valid for 24 hours.

---

## Data Model

| Entity | Role |
|---|---|
| `User` | Implements `UserDetails`; owns items, sales, and reviews |
| `Item` | A listing — category, status, price, watcher count |
| `Sale` | Transaction record linking buyer and seller to an item |
| `Review` | Buyer or seller review with a rating (`ReviewType`) |
| `Conversation` / `Message` | Chat thread and its messages |
| `Notification` | User-facing notification (`NotificationType`) |
| `CartItem` | A line in a user's cart |
| `SavedListing` | Watchlist entry |
| `ViewHistory` | Records item views for "recently viewed" |
| `UserSettings` | Per-user preferences |
| `Category` / `Status` / `Role` | Enums |

IDs are `Long` with `GenerationType.AUTO`.

---

## Project Structure

```
/
├── fronten/                          # React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── chat/                 # ChatConversation, ChatMessage, MessageInput, ConversationsList
│       │   ├── common/               # ItemCard, SearchBar, ReviewForm, RatingSummary, ...
│       │   └── layout/               # AppNavbar, DashboardSidebar, Footer, PageLayout
│       ├── hooks/                    # useWebSocket
│       ├── services/                 # ChatService, ReviewService, SaleService, WebSocketService, NotificationContext
│       ├── theme/                    # MUI theme, dark mode, animations
│       └── *.tsx                     # Page components (HomePage, ListingsPage, CartPage, ...)
│
├── src/main/java/org/marketplace/marketplace/
│   ├── auth/
│   │   ├── config/                   # SecurityConfiguration, JwtService, CustomOAuth2SuccessHandler, S3Config, CacheConfig
│   │   └── email/                    # EmailService
│   ├── config/                       # WebSocketConfig, WebSocketSecurityConfig, WebSocketAuthChannelInterceptor
│   ├── controllers/                  # REST controllers (api/v1/*)
│   ├── dto/                          # Response and request DTOs
│   ├── entities/                     # JPA entities
│   ├── exception/                    # GlobalExceptionHandler
│   ├── repository/                   # Spring Data repositories
│   ├── requests/                     # Request payloads
│   └── services/                     # Business logic
│
├── src/main/resources/
│   ├── application.yaml              # git-ignored — your local config
│   ├── application.yaml.example      # committed template
│   └── templates/                    # Thymeleaf
│
├── docs/                             # Feature notes
├── .env.example                      # committed template
└── .env                              # git-ignored — your secrets
```

### Code style

**Java** — Lombok throughout (`@Data`, `@Builder`, `@RequiredArgsConstructor`); constructor injection; controllers are `@RestController` plus `@RequestMapping("api/v1/{resource}")` and `@CrossOrigin`, returning `ResponseEntity<?>`; Jakarta Bean Validation (`@Valid`) on request DTOs.

**React/TypeScript** — functional components with hooks; strict mode with `noUnusedLocals` and `noUnusedParameters`; MUI `sx` mixed with Tailwind utilities; interfaces declared inline in the component that uses them.

---

## Security Notes

### Never commit secrets

`.env` and `src/main/resources/application.yaml` are git-ignored. Commit `.env.example` and `application.yaml.example` instead. Before pushing, confirm nothing sensitive is staged:

```bash
git status --porcelain
git diff --cached
```

`application.yaml.example` resolves every credential through `${ENV_VAR}` — keep it that way. Never add a literal fallback like `${AWS_SECRET_KEY:actual-secret}`, because the fallback *is* the secret.

### ⚠️ Dev login endpoints are currently unguarded

`DevController` exposes `api/v1/dev/quick-login`, `/login-as`, and `/create-test-user`. These create a user and mint a **valid JWT with no authentication**. The class is documented as dev-profile-only, but its `@Profile("dev")` annotation is **commented out**, and `SecurityConfiguration` marks `/api/v1/dev/**` as `permitAll()`.

As a result, anyone who can reach the server can mint a session for an arbitrary account. **Before deploying anywhere non-local**, re-enable the annotation in `DevController`:

```java
@Profile( "dev" )   // currently commented out
public class DevController {
```

### If a credential is ever exposed

Rotate first, then clean history — rewriting history does not un-leak an already-published secret:

1. **Azure AD** — Portal → App registrations → Certificates & secrets → delete and recreate.
2. **Supabase** — Project Settings → Database → reset password.
3. **AWS** — IAM → Users → Security credentials → deactivate and delete the key, then create a new one.
4. **JWT secret** — regenerate with `openssl rand -base64 32`. This invalidates all outstanding sessions.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `Could not resolve placeholder 'AWS_ACCESS_KEY'` | Environment variables aren't exported into the process running Spring Boot. Set them in your shell or IDE run configuration. |
| App fails to start, no `application.yaml` | It's git-ignored. Copy it from `application.yaml.example`. |
| CORS errors in the browser console | `FRONTEND_URL` doesn't match the origin Vite is serving from. |
| WebSocket won't connect | The origin must be `http://localhost:5173` or `http://localhost:3000` — see `WebSocketConfig`. Also confirm a valid JWT is in `localStorage`. |
| 401 on every request | Token expired (24 h lifetime). Log in again. |
| Image upload fails | Presigned URL expired (15 min), file exceeds 10 MB, or the IAM user lacks `s3:PutObject` on the bucket. |
| Hibernate schema errors | `ddl-auto: update` can't perform destructive changes. Reconcile the schema in Supabase manually. |
