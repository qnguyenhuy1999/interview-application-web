/**
 * MONOLITH (Before): Single NestJS app with all modules
 * MICROSERVICES (After): API Gateway as single entry point with routing, auth, rate limiting
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayController } from './gateway/api-gateway.controller';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ApiGatewayController],
  providers: [RateLimitGuard, LoggingInterceptor],
})
export class AppModule {}
