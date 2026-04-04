/**
 * MONOLITH (Before): Console.log statements scattered across controllers
 * MICROSERVICES (After): Structured JSON logging interceptor with correlation IDs
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

interface LogEntry {
  timestamp: string;
  correlationId: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  userAgent?: string;
  ip: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const startTime = Date.now();
    const correlationId =
      (req.headers['x-correlation-id'] as string) ||
      (req.headers['x-request-id'] as string) ||
      'unknown';

    return next.handle().pipe(
      tap(() => {
        const logEntry: LogEntry = {
          timestamp: new Date().toISOString(),
          correlationId,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          responseTime: Date.now() - startTime,
          userId: req.headers['x-user-id'] as string,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.socket.remoteAddress || 'unknown',
        };

        const logLine = JSON.stringify(logEntry);
        if (logEntry.statusCode >= 500) {
          console.error(`[API_LOG] ${logLine}`);
        } else if (logEntry.statusCode >= 400) {
          console.warn(`[API_LOG] ${logLine}`);
        } else {
          console.log(`[API_LOG] ${logLine}`);
        }
      }),
    );
  }
}
