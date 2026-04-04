import { KnowledgeGap } from "../entities/knowledge-gap.entity";

export interface CreateKnowledgeGapData {
  noteId: string;
  topic: string;
  description: string;
}

export interface KnowledgeGapRepositoryInterface {
  findAllByUserId(userId: string): Promise<KnowledgeGap[]>;
  create(data: CreateKnowledgeGapData): Promise<KnowledgeGap>;
  resolve(id: string): Promise<KnowledgeGap>;
  findById(id: string): Promise<KnowledgeGap | null>;
}
