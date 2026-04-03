export interface Quiz {
  id: string;
  noteId: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'open_ended';
  question: string;
  options?: string[];
  correctAnswer?: string;
  expectedKeyPoints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  createdAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[];
}

export interface QuizEvaluation {
  score: number;
  missingConcepts: string[];
  incorrectStatements: string[];
  feedback: string;
}

export interface GenerateQuizResponse {
  quizId: string;
  questions: QuizQuestion[];
}
