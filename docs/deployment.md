# Deployment Guide

## Architecture Overview

- **NestJS API**: Runs on Railway, Render, or Fly.io
- **Next.js Web**: Vercel (recommended) or Docker
- **Database**: Supabase Postgres (already configured via Prisma)

## Project Structure

```
apps/
  api/       # NestJS backend (Node.js)
  web/       # Next.js frontend (React)
packages/
  shared/    # Shared types and utilities
```

## Environment Variables

### API (apps/api/.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Supabase (if using Supabase Auth)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# AI (OpenAI compatible)
OPENAI_API_KEY=sk-proj-xxx
OPENAI_BASE_URL=https://api.openai.com/v1

# Auth
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_EXPIRATION=7d

# CORS
FRONTEND_URL=https://your-domain.vercel.app

# Node environment
NODE_ENV=production
```

### Web (apps/web/.env.local)

```env
# API endpoint (no trailing slash)
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

## Deployment Platforms

### Vercel (Web)

1. Connect your GitHub repo to Vercel
2. Set root directory: `apps/web`
3. Build command: `npm run build`
4. Output directory: `.next`
5. Environment variables: add `NEXT_PUBLIC_API_URL`
6. Add domains for production

### Railway / Render (API)

1. Connect your GitHub repo
2. Set root directory: `apps/api`
3. Build command: `npm install && npx prisma migrate deploy`
4. Start command: `npm run start:prod`
5. Environment variables: add all from `.env.example`

### Fly.io (API)

```bash
fly launch --apps-name interview-api
fly secrets set DATABASE_URL=postgresql://...
fly secrets set JWT_SECRET=...
fly deploy
```

## CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: cd apps/api && npm install
      - run: cd apps/api && npx prisma migrate deploy
      - run: cd apps/api && npm run build
      # Deploy to Railway/Render/Fly via their APIs

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: cd apps/web && npm install
      - run: cd apps/web && npm run build
      # Deploy to Vercel
```

## Database Migrations

Run migrations before deploying:

```bash
cd apps/api
npx prisma migrate deploy
```

## Performance

- **CDN**: Vercel Edge Network serves static assets automatically
- **Database**: Use connection pooling (PgBouncer or Supabase built-in)
- **Caching**: API client has in-memory LRU cache (100 items max)
- **API Gateway**: Consider adding Vercel Edge Functions for rate limiting

## Health Checks

API health endpoint: `GET /health`

```json
{
  "status": "ok",
  "timestamp": "2026-04-04T00:00:00.000Z"
}
```
