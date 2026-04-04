# Data Flow Documentation

## Request Lifecycle

This document traces the lifecycle of a typical request from client to database and back.

---

## 1. Client Request Flow

```
Browser / Mobile Client
    │
    │  HTTPS (TLS 1.3)
    │  Headers: Authorization: Bearer <JWT>, X-Request-ID: <uuid>
    ▼
Vercel Edge Network (if web) / CloudFront
    │  - SSL termination
    │  - WAF inspection (AWS WAF rules)
    │  - Geo-blocking
    ▼
API Gateway (Kong / NestJS Gateway)
    │  1. Extract and validate JWT
    │  2. Check rate limits (Redis token bucket)
    │  3. Inject X-User-Id, X-User-Email headers
    │  4. Route to downstream service
    │  5. Log request (structured JSON)
    ▼
```

---

## 2. Gateway Processing

```
API Gateway
    │
    ├── Rate Limit Guard
    │       │  GET from Redis: `ratelimit:user:{userId}`
    │       │  If count > limit → 429 Too Many Requests
    │       ▼
    │
    ├── Auth Guard (public routes skip)
    │       │  Validate JWT signature (HS256/RS256)
    │       │  Check token expiry
    │       │  Extract userId from `sub` claim
    │       │  Inject into request headers
    │       ▼
    │
    ├── Correlation ID Middleware
    │       │  Read X-Request-ID from header or generate UUID
    │       │  Propagate to all downstream calls
    │       │  Include in log entries
    │       ▼
    │
    └── Router
            │  Route table:
            │    POST /auth/*    → auth-service:3002
            │    GET  /notes/*   → notes-service:3003
            │    POST /notes/*   → notes-service:3003
            │    GET  /quizzes/* → quiz-service:3004
            │    POST /ai/*     → ai-service:3005
            ▼
      Downstream Service
```

---

## 3. Service Processing (Example: Create Note)

```
Notes Service (NestJS)
    │
    ├── Request DTO Validation
    │       │  class-validator: whitelist, transform, type coercion
    │       ▼
    │
    ├── Business Logic
    │       │  1. Check Redis cache: `notes:user:{userId}`
    │       │     If HIT → invalidate cache entry
    │       │
    │       │  2. Create note via Prisma
    │       │     Prisma → PgBouncer → PostgreSQL
    │       │
    │       │  3. Publish event (async): `note.created`
    │       │     Redis Pub/Sub → Quiz Service receives event
    │       │
    │       ▼
    │
    └── Response
            │  HTTP 201 Created
            │  Body: { id, title, content, topic, createdAt }
            │  Headers: X-Request-ID, X-Response-Time: 45ms
            ▼
```

---

## 4. Database Interaction

```
Notes Service
    │
    ├── Prisma Client
    │       │  Connection pool: 10 connections (via PgBouncer)
    │       │  Query timeout: 5 seconds
    │       ▼
    │
    ├── PgBouncer (connection pooler)
    │       │  Mode: transaction
    │       │  Max connections: 100 (pooled from 20 actual)
    │       │  Server idle timeout: 600s
    │       ▼
    │
    └── PostgreSQL (Supabase/RDS)
            │  Primary in US-EAST
            │  Read replicas in EU-WEST, AP-SOUTH (async)
            │  Indexes: [userId, topic], [userId, createdAt], [createdAt]
            ▼
```

---

## 5. Response Flow

```
PostgreSQL → Notes Service → API Gateway → Vercel Edge → Client
    │             │                │             │           │
  ~2ms           ~15ms            ~3ms          ~5ms        ~
```

---

## 6. AI Service Flow (Deep Dive Example)

```
Notes Service
    │
    ├── Receives: POST /notes/:id/deep-dive
    │  Validates ownership
    ▼
Notes Service → API Gateway → AI Service
    │  Proxy request with X-User-Id, X-Note-Id headers
    ▼
AI Service
    │
    ├── Check Redis: `ai:deepdive:{noteId}`
    │     If HIT → return cached response (~5ms)
    │
    ├── If MISS:
    │     1. Build prompts from packages/shared
    │     2. Call OpenAI GPT-4o (streaming disabled for this endpoint)
    │     3. Parse JSON response
    │     4. Store in Redis (TTL: 1 hour)
    │     5. Return response
    ▼
    Typical latencies:
      - Cache hit:  ~10ms
      - Cache miss: ~3000-8000ms (OpenAI API)
```

---

## 7. Quiz Generation Flow (Event-Driven)

```
1. User creates note
   Notes Service → DB → Publish `note.created` event (Redis Pub/Sub)

2. Quiz Service receives `note.created`
   Quiz Service → AI Service: generate quiz questions

3. AI Service processes
   Cached? → return | else → OpenAI API → cache → return

4. Quiz Service stores quiz
   Quiz Service → DB (Quiz table)

5. User fetches quiz
   Quiz Service → DB → return with attempts
```

---

## 8. Error Propagation

```
Database Error
    │
    ├── Prisma throws PrismaClientKnownRequestError
    │
    ├── Service catches → logs with correlation ID
    │     severity: error, correlationId: <uuid>, duration: <ms>
    │
    ├── Service returns structured error
    │     { statusCode: 500, message: "Internal server error",
    │       error: "DatabaseError", correlationId: <uuid> }
    │
    ├── API Gateway logs and forwards
    │
    └── Client receives HTTP 500 with error body

Circuit Breaker (AI Service Overload)
    │
    ├── Failure count > 5 in 30 seconds
    │
    ├── Circuit OPEN → return 503 Service Unavailable
    │     { message: "AI service temporarily unavailable. Please try again." }
    │
    ├── After 30s → circuit HALF-OPEN
    │     Allow 1 probe request
    │
    └── If probe succeeds → circuit CLOSED, resume normal operation
```

---

## 9. Cache Invalidation Strategy

```
Cache Hit Flow:
  Request → Gateway → Notes Service → Redis cache ──(HIT)───▶ Response (5ms)

Cache Miss Flow:
  Request → Gateway → Notes Service → Redis cache ──(MISS)──▶ PostgreSQL ──▶ Cache ──▶ Response (45ms)

Invalidation Events:
  - User updates note    → DELETE `notes:user:{userId}` (async)
  - User deletes note     → DELETE `notes:user:{userId}` + DELETE `notes:{noteId}`
  - Quiz generated       → DELETE `quiz:note:{noteId}`
  - AI response generated → Already cached with TTL (auto-expire)
```

---

## 10. Multi-Region Data Flow

```
Client (EU)
    │
    ├── Route 53 Latency Routing
    │
    ├── EU API Gateway (closest)
    │     │
    │     └── Routes to EU service replicas
    │           │
    │           └── EU Redis (replica) for reads
    │           └── EU PostgreSQL (read replica) for reads
    │
    └── Writes routed to US-EAST primary
          │  via private link / VPN
          │  Replication lag: ~100-500ms
          ▼
      US-EAST Primary Database
```
