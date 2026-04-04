import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().max(255, "Title must be at most 255 characters"),
  content: z.string().min(1, "Content is required"),
  topic: z.string().max(100, "Topic must be at most 100 characters").optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().max(255, "Title must be at most 255 characters").optional(),
  content: z.string().optional(),
  topic: z.string().max(100, "Topic must be at most 100 characters").optional(),
});

export const noteIdParamSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
export type NoteIdParam = z.infer<typeof noteIdParamSchema>;
