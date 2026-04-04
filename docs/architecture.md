# Enterprise Architecture — Interview Application

## Overview

**Scale Target:** 100k+ users, 10+ developers, multi-region deployment
**Current State:** NestJS monolith with Next.js 16 frontend (monorepo via pnpm workspaces)
**Target State:** Microservices architecture with API gateway, shared contracts, and dedicated services

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                        │
│                         Web App (Next.js 16)                                │
│                   SSR + React Server Components + RSC                       │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │ HTTPS (HTTP/2 + TLS 1.3)
┌──────────────────────────────▼──────────────────────────────────────────────┐
│                           API GATEWAY                                        │
│                    Kong / NGINX / AWS API GW                                 │
│  ┌─────────────┬──────────────┬──────────────┬──────────────────────────┐  │
│  │Rate Limiting│  Auth/Token  │   Routing    │   Observability          │  │
│  │             │  Validation  │              │   (Tracing + Logging)    │  │
│  └─────────────┴──────────────┴──────────────┴──────────────────────────┘  │
└──────┬─────────────┬──────────────┬──────────────┬───────────────────────┘
       │             │              │              │
  ┌────▼────┐  ┌─────▼────┐  ┌─────▼────┐  ┌─────▼─────┐
  │  Auth   │  │  Notes   │  │   Quiz   │  │    AI     │
  │ Service │  │ Service  │  │  Service │  │  Service  │
  │ :3002   │  │  :3003   │  │   :3004  │  │   :3005   │
  │         │  │          │  │          │  │           │
  │ JWT     │  │ CRUD     │  │ Generate │  │ OpenAI    │
  │ Register│  │ Search   │  │ Evaluate │  │ Deep Dive │
  │ Login   │  │ Grouped  │  │ Submit   │  │ KG Extract│
  │ Refresh │  │ DeepDive │  │ Attempts │  │           │
  └────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬─────┘
       │             │              │              │
┌──────▼─────────────▼──────────────▼──────────────▼──────────────────────────┐
│                         SHARED DATA LAYER                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   PostgreSQL     │  │     Redis        │  │      Object Storage      │  │
│  │   (Supabase /    │  │   (Session/Cache │  │    (S3 / R2 for AI       │  │
│  │    RDS Multi-AZ) │  │    + Rate Limit) │  │     generated content)   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CDN / WAF         │
                    │ (CloudFront / Vercel│
                    │  Edge Network)      │
                    └────────────────────┘
```

---

## Service Responsibilities

### API Gateway (`apps/api-gateway`)
- Single entry point for all client requests
- JWT token validation and user context injection
- Rate limiting per user/IP (token bucket algorithm)
- Request routing to downstream microservices
- Correlation ID propagation for distributed tracing
- Health check aggregation across all services
- Request/response logging (structured JSON)

### Auth Service (`apps/services/auth-service`)
- User registration and login (bcrypt, 12 rounds)
- JWT issuance (7-day expiry, RS256 or HS256)
- Token refresh mechanism
- Password reset flow (future)
- OAuth2 providers (future: Google, GitHub)

### Notes Service (`apps/services/notes-service`)
- CRUD operations for study notes
- Grouped listing by topic
- AI-powered deep dive generation
- Full-text search (PostgreSQL tsvector or Meilisearch)
- Ownership validation on every request

### Quiz Service (`apps/services/quiz-service`)
- AI-powered quiz generation from notes
- Quiz submission and evaluation
- Attempt tracking and scoring
- Feedback generation per question

### AI Service (`apps/services/ai-service`)
- OpenAI GPT-4o integration
- Prompt templates from `packages/shared`
- Retry logic with exponential backoff
- Response caching (Redis, 1-hour TTL)
- Token usage tracking and rate limiting

---

## Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| API Gateway | NestJS + Guards | Consistent NestJS patterns across monolith |
| Microservices | NestJS | Team familiarity, shared code patterns |
| Database | PostgreSQL (Supabase/RDS) | ACID compliance, JSONB for flexible schemas |
| Cache | Redis | Session store, rate limiting, AI response cache |
| Object Storage | S3 / Cloudflare R2 | AI-generated content, file uploads |
| CDN | Vercel Edge (web) + CloudFront (API) | Global low-latency delivery |
| Containerization | Docker + Docker Compose | Local dev parity with production |
| Orchestration | Kubernetes (EKS/GKE) | Auto-scaling, self-healing, rolling deploys |
| CI/CD | GitHub Actions | Native GitHub integration, matrix builds |
| Observability | OpenTelemetry + Datadog/Grafana | Distributed tracing, metrics, alerting |
| Service Mesh | Istio / Linkerd | mTLS between services, traffic management |

---

## Multi-Region Deployment

```
        ┌────────────────────┐
        │   Route 53 / GeoDNS │
        └────────┬───────────┘
     ┌───────────┼───────────┐
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│  US-EAST│ │ EU-WEST │ │ AP-SOUTH│
│ Primary │ │ Replica │ │ Replica │
│ RW Pool │ │ RO Pool │ │ RO Pool │
└─────────┘ └─────────┘ └─────────┘
```

- Primary region: US-EAST (read-write PostgreSQL)
- Replica regions: EU-WEST, AP-SOUTH (read replicas, async replication)
- Redis: Global cluster with read replicas per region
- API Gateway: Deployed in each region, Route 53 latency-based routing
- S3: Cross-region replication for object storage

---

## Security Considerations

1. **mTLS** between all internal services (Istio service mesh)
2. **JWT validation** at gateway — services trust gateway identity
3. **Rate limiting** at gateway (100 req/min per user, 1000 req/min per IP)
4. **WAF** rules at CDN edge (AWS WAF / Cloudflare)
5. **Secrets management** via AWS Secrets Manager / HashiCorp Vault
6. **Database encryption** at rest (AES-256) and in transit (TLS 1.3)
7. **Input validation** via class-validator Zod at every service boundary

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| API p99 latency | < 200ms | Caching, connection pooling, CDN |
| Web TTFB | < 50ms | Vercel Edge, RSC caching |
| Database queries | < 50ms | Indexes, read replicas, query analysis |
| AI response | < 10s | Streaming, caching, queue prioritization |
| Availability | 99.9% | Multi-AZ, circuit breakers, graceful degradation |
| Concurrent users | 100k+ | Horizontal auto-scaling, connection pooling |

---

## Connection Pooling & Caching Strategy

```
Client Request
      │
      ▼
API Gateway (validates JWT, rate limit)
      │
      ▼ [Cache Hit?]
  ┌────────┐  ──yes──► Return cached response
  │ Redis  │
  │ Cache  │
  └────┬───┘
       │ no
       ▼
 Downstream Service (reads from Redis session store)
       │
       ▼
 PostgreSQL (PgBouncer connection pool, 20-100 connections)
```

### Cache Keys
- `session:{userId}` — JWT session data (TTL: 7 days)
- `notes:user:{userId}` — User's note list (TTL: 5 min)
- `ai:deepdive:{noteId}` — AI deep dive response (TTL: 1 hour)
- `ai:quiz:{noteId}:v{version}` — Quiz questions (TTL: 30 min)

---

## Migration Phases

See [microservices-plan.md](./microservices-plan.md) for the detailed 4-phase migration strategy from monolith to microservices.
