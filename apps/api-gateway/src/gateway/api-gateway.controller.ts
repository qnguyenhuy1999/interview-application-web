/**
 * MONOLITH (Before): Single monolithic NestJS app serving all routes
 * MICROSERVICES (After): API Gateway controller routes requests to downstream services
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import {
  Controller,
  Get,
  All,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Headers,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class ApiGatewayController {
  private readonly services: Record<string, string>;

  constructor(private configService: ConfigService) {
    this.services = {
      auth: this.configService.get<string>('services.auth', 'http://localhost:3002'),
      notes: this.configService.get<string>('services.notes', 'http://localhost:3003'),
      quiz: this.configService.get<string>('services.quiz', 'http://localhost:3004'),
      ai: this.configService.get<string>('services.ai', 'http://localhost:3005'),
    };
  }

  @Get('health')
  health(): { status: string; timestamp: string; services: Record<string, string> } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: this.services,
    };
  }

  @Get('health/ready')
  async readinessCheck(): Promise<{ ready: boolean; checks: Record<string, boolean> }> {
    const checks: Record<string, boolean> = {};
    for (const [name, url] of Object.entries(this.services)) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const response = await fetch(`${url}/health`, { signal: controller.signal });
        clearTimeout(timeout);
        checks[name] = response.ok;
      } catch {
        checks[name] = false;
      }
    }
    const ready = Object.values(checks).every(Boolean);
    return { ready, checks };
  }

  // Auth routes
  @All('auth/:path(*)')
  @UseGuards(RateLimitGuard)
  async proxyAuth(@Req() req: Request, @Res() res: Response, @Body() _body: unknown) {
    await this.proxy(req, res, this.services.auth);
  }

  // Notes routes
  @All('notes/:path(*)')
  @UseGuards(RateLimitGuard)
  async proxyNotes(@Req() req: Request, @Res() res: Response, @Body() _body: unknown) {
    await this.proxy(req, res, this.services.notes);
  }

  // Quiz routes
  @All('quizzes/:path(*)')
  @UseGuards(RateLimitGuard)
  async proxyQuiz(@Req() req: Request, @Res() res: Response, @Body() _body: unknown) {
    await this.proxy(req, res, this.services.quiz);
  }

  // AI routes
  @All('ai/:path(*)')
  @UseGuards(RateLimitGuard)
  async proxyAI(@Req() req: Request, @Res() res: Response, @Body() _body: unknown) {
    await this.proxy(req, res, this.services.ai);
  }

  // Knowledge gaps routes
  @All('knowledge-gaps/:path(*)')
  @UseGuards(RateLimitGuard)
  async proxyKnowledgeGaps(@Req() req: Request, @Res() res: Response, @Body() _body: unknown) {
    await this.proxy(req, res, this.services.notes);
  }

  private async proxy(req: Request, res: Response, targetBase: string): Promise<void> {
    const correlationId =
      (req.headers['x-correlation-id'] as string) ||
      (req.headers['x-request-id'] as string) ||
      'unknown';

    const targetPath = req.originalUrl;
    const targetUrl = `${targetBase}${targetPath}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': correlationId,
      'X-Forwarded-For': req.ip || req.socket.remoteAddress || '',
      'X-Forwarded-Proto': 'https',
    };

    if (req.headers['x-user-id']) headers['X-User-Id'] = req.headers['x-user-id'] as string;
    if (req.headers['x-user-email']) headers['X-User-Email'] = req.headers['x-user-email'] as string;

    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.text();

      res.status(response.status);
      Object.entries(this.filterHeaders(response.headers)).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      res.setHeader('X-Request-ID', correlationId);
      res.setHeader('X-Response-Time', Date.now().toString());
      res.send(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(HttpStatus.BAD_GATEWAY);
      res.json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: `Service unavailable: ${message}`,
        error: 'Bad Gateway',
        correlationId,
      });
    }
  }

  private filterHeaders(headers: Headers): Record<string, string> {
    const excluded = ['host', 'connection', 'content-length'];
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      if (!excluded.includes(key.toLowerCase())) {
        result[key] = value;
      }
    });
    return result;
  }
}
