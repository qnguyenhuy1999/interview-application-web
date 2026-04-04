# Common Module

Production-ready cross-cutting concerns for the NestJS backend.

## Architecture

Each sub-module is designed to be independently replaceable — swap the in-memory implementation for Redis, swap the console logger for a distributed one, etc.

### Services

| Service | Purpose | Interface |
|---------|---------|-----------|
| `cache.service.ts` | Request-scoped caching with TTL | `ICachingService` |

### Decorators

| Decorator | Purpose |
|-----------|---------|
| `@Cacheable(key, ttl)` | Method-level cache result |
| `@CorrelationId()` | Inject correlation ID into use case |

### Interceptors

| Interceptor | Purpose |
|-------------|---------|
| `logging.interceptor.ts` | Structured JSON request/response logging with timing |

### Middleware

| Middleware | Purpose |
|------------|---------|
| `correlation-id.middleware.ts` | Injects or propagates `x-correlation-id` on every request |

### Filters

| Filter | Purpose |
|--------|---------|
| `all-exceptions.filter.ts` | Catches unhandled exceptions, maps Prisma errors, returns consistent JSON |

### DTOs

| DTO | Purpose |
|-----|---------|
| `pagination.dto.ts` | `PaginationDto`, `CursorPaginationDto`, `PaginatedResult<T>` |

---

## Microservices-Ready Architecture

The current monolith is structured to extract into microservices with minimal refactoring.

### Service Boundaries

The existing modules map cleanly to independent services:

| Module | Microservice | Port | Database Schema |
|--------|-------------|------|-----------------|
| `auth/*` | `auth-service` | 3001 | `users` table |
| `notes/*` | `notes-service` | 3002 | `notes`, `knowledge_gaps` tables |
| `quiz/*` | `quiz-service` | 3003 | `quizzes`, `quiz_attempts` tables |
| `ai/*` | `ai-service` | 3004 | No DB (stateless AI calls) |
| `health/*` | `health-service` | 3005 | No DB (health checks) |

### What Would Change

**1. Communication**
- Replace direct `PrismaService` calls across modules with HTTP/gRPC clients
- Add `ApiGateway` (e.g., NestJS + `@nestjs/microservices`) that routes by path:
  - `/auth/*` → `auth-service:3001`
  - `/notes/*` → `notes-service:3002`
  - `/quizzes/*` → `quiz-service:3003`
  - `/ai/*` → `ai-service:3004`

**2. Database**
- Each service gets its own connection pool to Postgres
- `notes-service` owns `notes` + `knowledge_gaps` tables
- `auth-service` owns `users` table
- `quiz-service` owns `quizzes` + `quiz_attempts` tables

**3. Auth Token Propagation**
- `auth-service` issues JWTs
- Other services validate JWTs via shared secret or JWKS endpoint
- Correlation IDs propagate via `x-correlation-id` header

**4. Infrastructure**
- Extract each service into its own `Dockerfile`
- Use Docker Compose or Kubernetes for orchestration
- Add Redis for distributed caching (replace in-memory `CacheService`)
- Add message queue (RabbitMQ/NATS) for async AI tasks

**5. Extracting Steps**
1. Move `apps/api/src/auth/` → `apps/auth-service/src/`
2. Move `apps/api/src/notes/` → `apps/notes-service/src/`
3. Move `apps/api/src/quiz/` → `apps/quiz-service/src/`
4. Move `apps/api/src/ai/` → `apps/ai-service/src/`
5. Create `apps/api-gateway/src/` with routing logic
6. Add HTTP clients in services that call other services
7. Configure CORS / API gateway to forward auth headers

### Preserving During Extraction

- All decorators, interceptors, and filters remain the same
- Domain exceptions in `common/exceptions/` get shared as a `@interview-app/common` package
- Pagination DTOs become shared contracts
- Error response shape stays consistent across services