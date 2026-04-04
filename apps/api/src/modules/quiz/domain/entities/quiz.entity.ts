export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  expectedKeyPoints?: string[];
}

export interface Quiz {
  id: string;
  noteId: string;
  questions: unknown;
  createdAt: Date;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: unknown;
  score: number;
  feedback: unknown;
  createdAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface QuizEvaluation {
  score: number;
  feedback: string;
  correct: boolean;
  explanation: string;
}

export interface QuizWithAttempts extends Quiz {
  attempts: QuizAttempt[];
}

export interface GenerateQuizResult {
  quizId: string;
  questions: QuizQuestion[];
}

export interface SubmitQuizResult {
  attempt: QuizAttempt;
  evaluations: QuizEvaluation[];
}
