import { Module } from '@nestjs/common';
import { KnowledgeGapsController } from './knowledge-gaps.controller';

@Module({
  controllers: [KnowledgeGapsController],
})
export class KnowledgeGapsModule {}
