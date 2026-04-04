/**
 * MONOLITH (Before): No shared contracts between services
 * MICROSERVICES (After): Type-safe API contracts for quiz service
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import type {
  GenerateQuizRequest,
  GenerateQuizResponse,
  QuizResponse,
  SubmitQuizRequest,
  QuizAttemptResponse,
} from './index';

export type {
  GenerateQuizRequest,
  GenerateQuizResponse,
  QuizResponse,
  SubmitQuizRequest,
  QuizAttemptResponse,
};

export const QuizRoutes = {
  GENERATE: (noteId: string) => `/notes/${noteId}/generate-quiz`,
  GET: (id: string) => `/quizzes/${id}`,
  PREVIOUS: (noteId: string) => `/notes/${noteId}/quiz/previous`,
  SUBMIT: (id: string) => `/quizzes/${id}/submit`,
} as const;
