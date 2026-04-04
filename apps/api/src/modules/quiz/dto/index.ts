import { z } from "zod";

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const submitQuizSchema = z.object({
  answers: z.array(quizAnswerSchema).min(1, "At least one answer is required"),
});

export const quizIdParamSchema = z.object({
  id: z.string().min(1, "Quiz ID is required"),
});

export const noteIdParamSchema = z.object({
  noteId: z.string().min(1, "Note ID is required"),
});

export type SubmitQuizDto = z.infer<typeof submitQuizSchema>;
export type QuizAnswerDto = z.infer<typeof quizAnswerSchema>;
