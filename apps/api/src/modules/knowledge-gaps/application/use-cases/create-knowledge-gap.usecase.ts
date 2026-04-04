import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { KnowledgeGap } from "../../domain/entities/knowledge-gap.entity";
import { KnowledgeGapRepositoryInterface } from "../../domain/repositories/knowledge-gap-repository.interface";
import { CreateKnowledgeGapDto } from "../../dto";

@Injectable()
export class CreateKnowledgeGapUseCase {
  constructor(
    private readonly knowledgeGapRepository: KnowledgeGapRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userId: string,
    dto: CreateKnowledgeGapDto,
  ): Promise<KnowledgeGap> {
    const note = await this.prisma.note.findUnique({
      where: { id: dto.noteId },
    });
    if (!note || note.userId !== userId) {
      throw new ForbiddenException("Note not found or access denied");
    }
    return this.knowledgeGapRepository.create({
      noteId: dto.noteId,
      topic: dto.topic,
      description: dto.description,
    });
  }
}
