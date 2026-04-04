# Notes Service

## Responsibility
Owns study notes CRUD, grouped listing, topic filtering, and knowledge gap tracking. This is the highest-traffic service.

## Endpoints
- `POST /notes` — Create note
- `GET /notes` — List all notes (sorted by createdAt desc)
- `GET /notes/grouped` — Group notes by topic
- `GET /notes/:id` — Get single note with ownership check
- `PUT /notes/:id` — Update note
- `DELETE /notes/:id` — Delete note (cascades to quizzes, attempts, gaps)
- `GET /knowledge-gaps` — List all knowledge gaps for user's notes
- `POST /knowledge-gaps` — Create a knowledge gap
- `PATCH /knowledge-gaps/:id/resolve` — Mark gap as resolved

## Database
Owns `Note` and `KnowledgeGap` tables. Shared PostgreSQL via PgBouncer.

## Communication
- Receives authenticated requests via API Gateway
- Trust model: X-User-Id header from gateway (internal mTLS)
- Future: Publishes `note.created` event to trigger quiz auto-generation

## Scale Considerations
- Redis cache for user's note list (TTL: 5 min, invalidated on write)
- Read replicas for listing queries
- Add PostgreSQL full-text search (tsvector) for note content search
