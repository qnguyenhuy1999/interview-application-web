# Quiz Service

## Responsibility
Owns quiz generation, evaluation, and attempt tracking. Calls AI service for question generation and answer evaluation.

## Endpoints
- `POST /notes/:noteId/generate-quiz` — Generate quiz questions via AI
- `GET /quizzes/:id` — Get quiz with attempts
- `GET /notes/:noteId/quiz/previous` — Load most recent quiz for a note
- `POST /quizzes/:id/submit` — Submit answers and receive evaluation

## Database
Owns `Quiz` and `QuizAttempt` tables. Shared PostgreSQL.

## Communication
- Receives requests via API Gateway
- Calls AI Service (HTTP) for quiz generation and answer evaluation
- Future: Subscribes to `note.created` event for auto-quiz generation

## Scale Considerations
- Quiz results cached in Redis (TTL: 30 min)
- Rate limit: 10 submission attempts per quiz per hour
- Read replicas for quiz listing queries
