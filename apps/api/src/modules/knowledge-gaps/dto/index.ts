import { z } from "zod";

export const createKnowledgeGapSchema = z.object({
  noteId: z.string().min(1, "Note ID is required"),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
});

export const knowledgeGapIdParamSchema = z.object({
  id: z.string().min(1, "Knowledge gap ID is required"),
});

export type CreateKnowledgeGapDto = z.infer<typeof createKnowledgeGapSchema>;
export type KnowledgeGapIdParam = z.infer<typeof knowledgeGapIdParamSchema>;
