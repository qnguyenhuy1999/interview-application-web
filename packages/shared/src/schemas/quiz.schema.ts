import { z } from "zod";

export const quizQuestionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["multiple_choice", "open_ended", "scenario_based"]),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  correct_answer: z.string().optional(),
  expectedKeyPoints: z.array(z.string()).optional(),
  expected_key_points: z.array(z.string()).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    }),
  ),
});

export const quizEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  missing_concepts: z.array(z.string()),
  incorrect_statements: z.array(z.string()),
  feedback: z.string(),
});

export type QuizQuestionSchema = z.infer<typeof quizQuestionSchema>;
export type SubmitQuizSchema = z.infer<typeof submitQuizSchema>;
export type QuizEvaluationSchema = z.infer<typeof quizEvaluationSchema>;
