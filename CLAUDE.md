# Florida Poly MarketPlace

## Project Overview

University marketplace for Florida Polytechnic students to buy/sell items. Full-stack application with Spring Boot REST API backend and React SPA frontend. Supports real-time chat via WebSockets, Azure AD authentication, image uploads to AWS S3, and PostgreSQL persistence via Supabase.

## Tech Stack

### Frontend (`/fronten`)
- **Framework**: React 19 + Vite 6.2
- **Language**: TypeScript 5.7 (strict mode enabled)
- **Styling**: Tailwind CSS 4.0 + MUI 6.4 (Material UI)
- **Routing**: React Router DOM 7.2
- **HTTP Client**: Axios 1.8
- **Real-time**: STOMP.js + SockJS for WebSocket chat
- **Animations**: Framer Motion 12.5
- **Date Handling**: date-fns 4.1

### Backend (`/src`)
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 21
- **Build Tool**: Maven
- **Database**: PostgreSQL (Supabase hosted)
- **ORM**: Spring Data JPA / Hibernate
- **Authentication**: Azure AD OAuth2 + JWT (jjwt 0.12.6)
- **File Storage**: AWS S3
- **Cache**: Caffeine
- **WebSockets**: Spring WebSocket + STOMP

## Architecture & Project Structure

```
/
├── fronten/                    # Frontend (React + Vite)
│   └── src/
│       ├── components/
│       │   ├── chat/           # Chat UI components
│       │   ├── common/         # Reusable: ItemCard, SearchBar, ReviewForm, etc.
│       │   └── layout/         # AppNavbar, DashboardSidebar, Footer, PageLayout
│       ├── hooks/              # useWebSocket
│       ├── services/           # API services, WebSocketService, NotificationContext
│       ├── theme/              # MUI theme config, dark mode, animations
│       └── *.tsx               # Page components (HomePage, ListingsPage, etc.)
│
├── src/main/java/org/marketplace/marketplace/
│   ├── auth/
│   │   ├── config/             # SecurityConfiguration, JwtService, OAuth2Handler, S3Config, CacheConfig
│   │   └── email/              # Email service
│   ├── config/                 # WebSocketConfig, WebSocketSecurityConfig
│   ├── controllers/            # REST controllers (api/v1/*)
│   ├── dto/                    # Data Transfer Objects
│   ├── entities/               # JPA entities (User, Item, Sale, Review, etc.)
│   ├── exception/              # Exception handlers
│   ├── repository/             # Spring Data repositories
│   ├── requests/               # Request payload classes
│   └── services/               # Business logic services
│
└── src/main/resources/
    ├── application.yaml        # Spring config
    └── templates/              # Thymeleaf templates (if any)
```

### API Patterns
- **REST Base Path**: `api/v1/{resource}` (e.g., `api/v1/item`, `api/v1/cart`)
- **WebSocket Endpoint**: `/ws` with STOMP
- **Controller Injection**: Constructor injection via `@RequiredArgsConstructor`
- **Validation**: Jakarta Bean Validation (`@Valid`)

### Frontend Patterns
- **Axios**: Direct axios calls in page components (no centralized API layer)
- **State**: React Context for notifications; local state for most pages
- **Services**: `WebSocketService.ts`, `ChatService.ts`, `ReviewService.ts`, `SaleService.ts`

## Development Workflow

### Frontend
```bash
cd fronten
npm install
npm run dev          # Start Vite dev server (default: localhost:5173)
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint
```

### Backend
```bash
./mvnw spring-boot:run    # Start Spring Boot (default: localhost:8080)
./mvnw clean install      # Build with Maven
```

### Port Configuration
| Service  | Port |
|----------|------|
| Spring Boot | 8080 |
| Vite Dev | 5173 |

**Note**: No Vite proxy configured in `vite.config.ts`. Frontend makes direct API calls (CORS enabled via `@CrossOrigin` on controllers).

## Active Features

- [x] OAuth2 login (Azure AD) with JWT session
- [x] Item listings (create, search, browse by category)
- [x] Shopping cart
- [x] Real-time chat (WebSocket/STOMP)
- [x] Notifications system
- [x] User reviews (buyer/seller)
- [x] Sales tracking (mark as sold)
- [x] Saved items / watchlist
- [x] View history
- [x] User profiles with ratings
- [x] Image uploads (AWS S3 presigned URLs)
- [x] Dark mode theme support
- [ ] Payment integration (PaymentController exists but minimal)

## Code Style & Conventions

### Java (Backend)
- **Lombok**: Heavy usage - `@Data`, `@Builder`, `@RequiredArgsConstructor`, `@AllArgsConstructor`, `@NoArgsConstructor`
- **Entity Pattern**: JPA entities implement domain interfaces (e.g., `User implements UserDetails`)
- **Controller Pattern**:
  - `@RestController` + `@RequestMapping("api/v1/{resource}")`
  - `@CrossOrigin` on all controllers
  - Returns `ResponseEntity<?>` with DTOs
- **Naming**: PascalCase classes, camelCase methods/fields
- **Validation**: Jakarta validation annotations on request DTOs
- **ID Fields**: `Long` type, `GenerationType.AUTO`

### React/TypeScript (Frontend)
- **Strict Mode**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- **Components**: Functional components with hooks
- **File Structure**: Page components in `src/` root, reusable in `components/`
- **Imports**: Named imports for MUI, relative imports for local modules
- **Styling**: MUI `sx` prop + Tailwind utility classes mixed
- **Types**: Inline interfaces in components (no centralized types directory)

## Key Entities

| Entity | Description |
|--------|-------------|
| User | Implements `UserDetails`, owns items, sales, reviews |
| Item | Marketplace listing with category, status, watchers |
| Sale | Transaction record linking buyer/seller |
| Review | Buyer/seller reviews with rating |
| Conversation/Message | Chat between users |
| Notification | User notifications |
| CartItem | Shopping cart items |
| SavedListing | Watchlist/favorites |

## Environment Configuration

Backend config in `src/main/resources/application.yaml`:
- Azure AD OAuth2 (tenant-specific)
- PostgreSQL via Supabase
- AWS S3 credentials
- JWT secret/expiration
