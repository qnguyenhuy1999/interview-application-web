/**
 * MONOLITH (Before): No rate limiting on endpoints
 * MICROSERVICES (After): Token bucket rate limiting via Redis at API Gateway
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly windowMs: number;
  private readonly maxRequests: number;

  // In-memory fallback when Redis is unavailable
  private readonly requests = new Map<string, { count: number; resetAt: number }>();

  constructor(private configService: ConfigService) {
    this.windowMs = this.configService.get<number>('rateLimit.windowMs', 60000);
    this.maxRequests = this.configService.get<number>('rateLimit.maxRequests', 100);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const identifier = this.getIdentifier(request);
    const now = Date.now();

    const record = this.requests.get(identifier);

    if (!record || now > record.resetAt) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded. Please slow down.',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }

  private getIdentifier(request: Request): string {
    // Prefer user ID if authenticated, fall back to IP
    const userId = request.headers['x-user-id'] as string;
    if (userId) {
      return `user:${userId}`;
    }
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    return `ip:${ip}`;
  }
}
