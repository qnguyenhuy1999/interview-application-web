import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { QuizModule } from './quiz/quiz.module';
import { AiModule } from './ai/ai.module';
import { KnowledgeGapsModule } from './knowledge-gaps/knowledge-gaps.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
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
