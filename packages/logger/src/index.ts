/**
 * MONOLITH (Before): Console.log scattered across services
 * MICROSERVICES (After): Structured JSON logger with correlation IDs for distributed tracing
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
export { LoggerService, LogLevel, LogEntry } from './logger.service';
