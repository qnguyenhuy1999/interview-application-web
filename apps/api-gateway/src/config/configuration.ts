/**
 * MONOLITH (Before): Direct environment variable access throughout services
 * MICROSERVICES (After): Centralized configuration with typed environment schema
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
    notes: process.env.NOTES_SERVICE_URL || 'http://localhost:3003',
    quiz: process.env.QUIZ_SERVICE_URL || 'http://localhost:3004',
    ai: process.env.AI_SERVICE_URL || 'http://localhost:3005',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});
