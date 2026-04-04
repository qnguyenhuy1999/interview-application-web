/**
 * MONOLITH (Before): AiModule embedded in main NestJS app
 * MICROSERVICES (After): Standalone AI Service with caching and retry logic
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AppModule {}
