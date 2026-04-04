import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { KnowledgeGap } from "../../domain/entities/knowledge-gap.entity";
import { KnowledgeGapRepositoryInterface } from "../../domain/repositories/knowledge-gap-repository.interface";

@Injectable()
export class ResolveKnowledgeGapUseCase {
  constructor(
    private readonly knowledgeGapRepository: KnowledgeGapRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, gapId: string): Promise<KnowledgeGap> {
    const gap = await this.knowledgeGapRepository.findById(gapId);
    if (!gap) throw new ForbiddenException("Knowledge gap not found");
    const note = await this.prisma.note.findUnique({
      where: { id: gap.noteId },
    });
    if (!note || note.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }
    return this.knowledgeGapRepository.resolve(gapId);
  }
}
