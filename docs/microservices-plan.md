# Microservices Migration Plan

## Phase 0: Infrastructure Foundation (Weeks 1-2)

**Goal:** Set up all infrastructure without changing production traffic.

### Checklist
- [ ] Set up Docker Compose with Postgres + Redis for local dev
- [ ] Create API Gateway (`apps/api-gateway`) with basic routing
- [ ] Create shared contracts package (`packages/api-contracts`)
- [ ] Create shared logger package (`packages/logger`)
- [ ] Set up GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`)
- [ ] Configure Dockerfiles for each service
- [ ] Set up monitoring: OpenTelemetry traces, Prometheus metrics, Grafana dashboards
- [ ] Define service-to-service communication protocols (REST over HTTP, JSON)
- [ ] Establish shared Prisma schema + migrations workflow
- [ ] Document API contracts in `packages/api-contracts/src/`

### Rollback Plan
- All services containerized but not receiving traffic
- Original monolith remains the single entry point
- Feature flags control which services receive requests

---

## Phase 1: Extract AI Service (Weeks 3-5)

**Rationale:** AI service has the fewest data dependencies. It only needs note content (passed by reference) and returns structured JSON. No shared database tables exclusive to AI.

### Service Boundaries
- **Owns:** AI prompt templates, OpenAI API calls, response parsing
- **Dependencies:** `packages/shared` (prompts), OpenAI API key
- **Data:** No persistent data — stateless, pure computation

### Migration Steps
1. [ ] Create `apps/services/ai-service` with NestJS bootstrap
2. [ ] Move `AiService` logic from `apps/api/src/ai/` to AI service
3. [ ] Deploy AI service behind API gateway (new route: `/ai/*`)
4. [ ] Update API Gateway to proxy `/ai/*` to AI service
5. [ ] Add Redis cache layer for AI responses (cache key: `ai:hash:{content}`)
6. [ ] Add retry with exponential backoff (3 retries: 1s, 2s, 4s)
7. [ ] Implement circuit breaker (failure threshold: 5, timeout: 30s)
8. [ ] Load test: simulate 1000 concurrent AI requests
9. [ ] Enable AI service traffic via feature flag (e.g., `USE_AI_SERVICE=true`)

### Traffic Switch
```
Before: NotesService → calls AiService (in-process method call)
After:  NotesService → API Gateway → AI Service (HTTP over LAN/mTLS)
```

### Rollback
- Set `USE_AI_SERVICE=false` env var
- API Gateway routes `/ai/*` back to monolith `AiModule`
- No data migration needed (stateless service)

---

## Phase 2: Extract Quiz Service (Weeks 6-8)

**Rationale:** Quiz service has clear ownership of `Quiz` and `QuizAttempt` tables. It calls AI service internally, which is now isolated.

### Service Boundaries
- **Owns:** `Quiz`, `QuizAttempt` database tables
- **Dependencies:** `apps/services/ai-service` (for generation/evaluation), `packages/shared`
- **Data:** Quiz questions stored as JSONB, attempts with scores

### Migration Steps
1. [ ] Create `apps/services/quiz-service` with NestJS bootstrap
2. [ ] Move `QuizService`, `QuizController`, `QuizModule` from monolith
3. [ ] Update Prisma schema — quiz service has its own Prisma client pointing to shared DB
4. [ ] Add database indexes for `noteId` on Quiz and `quizId` on QuizAttempt
5. [ ] Deploy behind API Gateway (route: `/quiz/*` and `/notes/:noteId/generate-quiz`)
6. [ ] Update NotesService to call QuizService via HTTP (not in-process)
7. [ ] Add quiz-specific caching (generated quizzes cached for 30 min)
8. [ ] Implement quiz attempt rate limiting (max 10 attempts per quiz per hour)
9. [ ] Load test: 500 concurrent quiz submissions
10. [ ] Enable via feature flag

### Database Changes
```prisma
// Quiz table — add index
@@index([noteId])  // already planned in schema.prisma

// QuizAttempt table — add index
@@index([quizId])
@@index([createdAt])  // for time-based analytics
```

### Rollback
- Set `USE_QUIZ_SERVICE=false`
- API Gateway routes `/quiz/*` back to monolith `QuizModule`
- Database tables remain shared (no migration needed for rollback)

---

## Phase 3: Extract Notes Service (Weeks 9-11)

**Rationale:** Notes service owns the core `Note` table and is the highest-traffic service. It has dependencies on AI service (already extracted) and quiz service.

### Service Boundaries
- **Owns:** `Note` table, note CRUD, grouped listing, topic filtering
- **Dependencies:** `apps/services/ai-service` (deep dive), `apps/services/quiz-service` (via events)
- **Data:** Note content, title, topic, AI explanation

### Migration Steps
1. [ ] Create `apps/services/notes-service` with NestJS bootstrap
2. [ ] Move `NotesService`, `NotesController`, `NotesModule` from monolith
3. [ ] Update API Gateway routes: `/notes/*` → notes-service
4. [ ] Extract KnowledgeGaps into notes-service (it logically belongs here)
5. [ ] Implement async event: when note is created, publish `note.created` event
6. [ ] Quiz service subscribes to `note.created` for auto-quiz generation (future)
7. [ ] Add full-text search (PostgreSQL `tsvector` or Meilisearch)
8. [ ] Add database indexes: `[userId, createdAt]`, `[userId, topic]`
9. [ ] Implement optimistic locking for note updates (prevent race conditions)
10. [ ] Load test: 2000 concurrent note list requests
11. [ ] Enable via feature flag

### Event-Driven Communication
```
Notes Service                    Quiz Service
    │                                  │
    │── note.created (Kafka/Redis) ───▶│  (triggers auto-quiz generation)
    │                                  │
    │◀── quiz.generated (reply) ───────│
```

### Rollback
- Set `USE_NOTES_SERVICE=false`
- API Gateway routes `/notes/*` back to monolith `NotesModule`
- Knowledge gaps data preserved (shared database)

---

## Phase 4: Extract Auth Service (Weeks 12-14)

**Rationale:** Auth service is the most critical and sensitive. Extracting it last ensures all other services are stable and can be updated to use token-based auth independently.

### Service Boundaries
- **Owns:** `User` table, JWT issuance, registration, login
- **Dependencies:** None (foundational service)
- **Data:** User credentials, JWT blacklist (Redis)

### Migration Steps
1. [ ] Create `apps/services/auth-service` with NestJS bootstrap
2. [ ] Move `AuthService`, `AuthController`, `AuthModule`, `JwtStrategy` from monolith
3. [ ] Move JWT handling from monolith to auth service
4. [ ] Update API Gateway to validate tokens via auth service (or use shared JWT secret)
5. [ ] Implement token introspection endpoint for gateway
6. [ ] Add Redis-backed JWT blacklist for logout/revocation
7. [ ] Add brute-force protection (login rate limiting: 5 attempts per 15 min)
8. [ ] Implement refresh token rotation
9. [ ] Update all other services to trust gateway-injected user context
10. [ ] Load test: 5000 concurrent authenticated requests
11. [ ] Enable via feature flag

### Token Validation Flow
```
Before: Each service validates JWT using shared JwtStrategy (duplicate validation)
After:  API Gateway validates JWT once, injects user context via headers
        Downstream services trust X-User-Id, X-User-Email headers (internal mTLS)
```

### Rollback
- Set `USE_AUTH_SERVICE=false`
- All services fall back to local JWT validation
- Users may need to re-authenticate (brief disruption window)

---

## Phase 5: Production Cutover (Week 15)

**Goal:** Full microservices in production, monolith decommissioned.

### Checklist
- [ ] All feature flags set to microservices mode
- [ ] Monolith receives zero traffic
- [ ] Database schema migrations complete
- [ ] All 5 services auto-scaling policies configured
- [ ] Load tests passed at 2x peak traffic
- [ ] Runbooks documented for each service
- [ ] On-call rotation configured
- [ ] Monolith code archived (not deleted)
- [ ] Post-migration monitoring review (48-hour observation window)

### Monitoring Metrics to Verify
- Error rate per service < 0.1%
- p99 latency per service < 200ms
- Gateway proxy overhead < 5ms
- Redis cache hit rate > 70%
- Database connection pool utilization < 80%

---

## Service Communication Patterns

### Synchronous (HTTP/REST)
Used for: User-facing requests requiring immediate response
- Client → Gateway → Service → Database → Response
- Timeout: 30s max
- Retry: 3x with exponential backoff (services only)

### Asynchronous (Redis Pub/Sub / Kafka)
Used for: Event-driven workflows, analytics, notifications
- `note.created` — Triggers quiz generation
- `quiz.completed` — Updates analytics
- `user.registered` — Triggers welcome email (future)

### Service Discovery
- **Development:** Docker Compose service names (e.g., `http://auth-service:3002`)
- **Production:** Kubernetes DNS (e.g., `http://auth-service.default.svc.cluster.local`)
- **External:** API Gateway routes all public traffic

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Network latency overhead | Medium | Medium | Co-locate services in same AZ, add caching |
| Distributed tracing complexity | High | Low | OpenTelemetry auto-instrumentation |
| Database connection pool exhaustion | High | High | PgBouncer, read replicas, query optimization |
| AI service rate limiting | High | Medium | Aggressive caching, queue with priority levels |
| Auth service single point of failure | Low | Critical | Multi-AZ deployment, cached token validation |
| Data consistency across services | Medium | High | Event sourcing for critical state, eventual consistency acceptable for analytics |
