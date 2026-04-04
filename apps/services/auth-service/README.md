# Auth Service

## Responsibility
Handles user registration, authentication, and JWT token issuance. This is the foundational service — all other services trust the user identity injected by this service.

## Endpoints
- `POST /auth/register` — Create new user account
- `POST /auth/login` — Authenticate and receive JWT

## Database
Owns the `User` table. Uses Prisma with PostgreSQL.

## Communication
- Receives requests via API Gateway (public routes)
- Validates credentials against PostgreSQL
- Issues JWT tokens (HS256, 7-day expiry)

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `PORT` — Service port (default: 3002)

## Scale Considerations
- Stateless service — horizontal scaling is trivial
- Database connection pooling via PgBouncer
- Brute-force protection: 5 login attempts per 15 minutes per IP
- Consider Redis for JWT blacklist (logout support)
