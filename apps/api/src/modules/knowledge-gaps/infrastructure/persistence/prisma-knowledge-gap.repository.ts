import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { KnowledgeGap } from "../../domain/entities/knowledge-gap.entity";
import {
    CreateKnowledgeGapData,
    KnowledgeGapRepositoryInterface,
} from "../../domain/repositories/knowledge-gap-repository.interface";

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
export class PrismaKnowledgeGapRepository implements KnowledgeGapRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string): Promise<KnowledgeGap[]> {
    const notes = await this.prisma.note.findMany({
      where: { userId },
      include: { knowledgeGaps: true },
    });
    return notes.flatMap((note: NoteWithKnowledgeGaps) => note.knowledgeGaps);
  }

  async create(data: CreateKnowledgeGapData): Promise<KnowledgeGap> {
    return this.prisma.knowledgeGap.create({ data });
  }

  async resolve(id: string): Promise<KnowledgeGap> {
    return this.prisma.knowledgeGap.update({
      where: { id },
      data: { resolved: true },
    });
  }

  async findById(id: string): Promise<KnowledgeGap | null> {
    return this.prisma.knowledgeGap.findUnique({ where: { id } });
  }
}
