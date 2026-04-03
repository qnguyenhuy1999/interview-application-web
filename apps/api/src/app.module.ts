import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { QuizModule } from './quiz/quiz.module';
import { AiModule } from './ai/ai.module';
import { KnowledgeGapsModule } from './knowledge-gaps/knowledge-gaps.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '..', '.env') }),
    PrismaModule,
    AuthModule,
    NotesModule,
    QuizModule,
    AiModule,
    KnowledgeGapsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
