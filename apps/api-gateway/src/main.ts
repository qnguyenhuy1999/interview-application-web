/**
 * MONOLITH (Before): Single NestJS app with all modules
 * MICROSERVICES (After): API Gateway as single entry point with routing, auth, rate limiting
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway running on http://localhost:${port}`);
}

bootstrap();
