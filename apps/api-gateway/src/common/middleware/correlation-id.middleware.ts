/**
 * MONOLITH (Before): No correlation tracking across service calls
 * MICROSERVICES (After): Correlation ID middleware propagates request IDs across all services
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = (req.headers['x-request-id'] as string) || randomUUID();
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('X-Request-ID', correlationId);
    next();
  }
}
