import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { join } from "path";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { CorrelationIdMiddleware } from "./common/middleware/correlation-id.middleware";
import { PrismaModule } from "./database/prisma/prisma.module";
import { HealthController } from "./health/health.controller";
import { AiModule } from "./modules/ai/ai.module";
import { AuthModule } from "./modules/auth/auth.module";
import { KnowledgeGapsModule } from "./modules/knowledge-gaps/knowledge-gaps.module";
import { NotesModule } from "./modules/notes/notes.module";
import { QuizModule } from "./modules/quiz/quiz.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, "..", ".env"),
    }),
    // Rate limiting: 100 requests/minute globally, 10 requests/minute for auth endpoints (bruteforce protection)
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 60_000,
        limit: 100,
      },
      {
        name: "auth",
        ttl: 60_000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    NotesModule,
    QuizModule,
    AiModule,
    KnowledgeGapsModule,
  ],
  controllers: [HealthController],
  providers: [
    // Global exception filter
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // Global logging interceptor
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    // Global rate limiting + JWT guard
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
}
