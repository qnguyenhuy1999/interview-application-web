/**
 * MONOLITH (Before): NotesModule embedded in main NestJS app
 * MICROSERVICES (After): Standalone Notes Service with its own deployment unit
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { KnowledgeGapsController } from './knowledge-gaps.controller';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [NotesController, KnowledgeGapsController],
  providers: [NotesService],
})
export class AppModule {}
