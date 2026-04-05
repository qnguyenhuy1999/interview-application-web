import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import {
  KnowledgeGap,
  KnowledgeGapWithNoteTitle,
} from "../../domain/entities/knowledge-gap.entity";
import { KnowledgeGapRepositoryInterface } from "../../domain/repositories/knowledge-gap-repository.interface";

interface NoteWithKnowledgeGaps {
  id: string;
  title: string;
  content: string;
  topic: string | null;
  aiExplanation: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  knowledgeGaps: KnowledgeGap[];
}

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
    return notes.flatMap((note: NoteWithKnowledgeGaps) =>
      note.knowledgeGaps.map((gap) => ({ ...gap, noteTitle: note.title })),
    );
  }
}
