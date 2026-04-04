# AI Service

## Responsibility
Pure AI processing — wraps OpenAI API with retry logic, caching, and structured prompts. Stateless, easy to scale independently.

## Endpoints
- `POST /ai/generate-quiz` — Generate quiz questions from note content
- `POST /ai/deep-dive` — Generate AI explanation of note
- `POST /ai/evaluate-answer` — Evaluate user's answer against expected key points

## Dependencies
- OpenAI API key (`OPENAI_API_KEY`)
- Redis (for response caching)

## Communication
- Called by Notes Service and Quiz Service via HTTP
- No persistent data — stateless service

## Scale Considerations
- Redis cache with 1-hour TTL for deep dive results
- Exponential backoff retry (3 attempts: 1s, 2s, 4s)
- Circuit breaker: open after 5 failures in 30 seconds
- Token usage tracking for cost monitoring
