import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { KnowledgeGapWithNoteTitle } from "../../domain/entities/knowledge-gap.entity";
import { KnowledgeGapRepositoryInterface } from "../../domain/repositories/knowledge-gap-repository.interface";

@Injectable()
export class FindKnowledgeGapsUseCase {
  constructor(
    private readonly knowledgeGapRepository: KnowledgeGapRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string): Promise<KnowledgeGapWithNoteTitle[]> {
    const notes = await this.prisma.note.findMany({
      where: { userId },
      include: { knowledgeGaps: true },
    });
    return notes.flatMap((note) =>
      note.knowledgeGaps.map((gap) => ({ ...gap, noteTitle: note.title })),
    );
  }
}
