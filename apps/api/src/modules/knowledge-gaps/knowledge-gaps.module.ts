import { Module } from "@nestjs/common";
import { CreateKnowledgeGapUseCase } from "./application/use-cases/create-knowledge-gap.usecase";
import { FindKnowledgeGapsUseCase } from "./application/use-cases/find-knowledge-gaps.usecase";
import { ResolveKnowledgeGapUseCase } from "./application/use-cases/resolve-knowledge-gap.usecase";
import { PrismaKnowledgeGapRepository } from "./infrastructure/persistence/prisma-knowledge-gap.repository";
import { KnowledgeGapsController } from "./presentation/controllers/knowledge-gaps.controller";

@Module({
  controllers: [KnowledgeGapsController],
  providers: [
    PrismaKnowledgeGapRepository,
    FindKnowledgeGapsUseCase,
    CreateKnowledgeGapUseCase,
    ResolveKnowledgeGapUseCase,
  ],
  exports: [],
})
export class KnowledgeGapsModule {}
