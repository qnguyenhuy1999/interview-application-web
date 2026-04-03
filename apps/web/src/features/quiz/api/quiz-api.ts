import { apiClient } from '@shared/lib/api-client';
import type {
  Quiz,
  SubmitQuizRequest,
  SubmitQuizResponse,
  QuizEvaluation,
} from '@shared/types';

export async function getQuiz(quizId: string, token: string): Promise<Quiz> {
  return apiClient<Quiz>(`/quizzes/${quizId}`, { token });
}

export async function submitQuiz(
  quizId: string,
  answers: SubmitQuizRequest['answers'],
  token: string,
): Promise<SubmitQuizResponse> {
  return apiClient<SubmitQuizResponse>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: { answers },
    token,
  });
}