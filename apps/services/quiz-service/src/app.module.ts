/**
 * MONOLITH (Before): QuizModule embedded in main NestJS app
 * MICROSERVICES (After): Standalone Quiz Service with its own deployment unit
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class AppModule {}
