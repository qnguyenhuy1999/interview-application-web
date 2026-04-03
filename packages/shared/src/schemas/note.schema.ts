import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  topic: z.string().max(100).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  topic: z.string().max(100).optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;
