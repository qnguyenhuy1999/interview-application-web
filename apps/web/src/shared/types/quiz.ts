export type QuestionType = 'multiple_choice' | 'open_ended' | 'scenario_based';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id?: string;
  type: QuestionType;
  question: string;
  options?: string[];
  difficulty: Difficulty;
}

export interface QuizQuestionGroup {
  questions: QuizQuestion[];
}

export interface QuizAttemptAnswer {
  questionId: string;
  answer: string;
}

export interface QuizAttempt {
  id: string;
  answers: QuizAttemptAnswer[];
  score: number;
  feedback?: QuizEvaluation[] | null;
  createdAt: string;
}

export interface QuizNote {
  id: string;
  title: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestionGroup;
  attempts: QuizAttempt[];
  note: QuizNote;
}

export interface QuizEvaluation {
  score: number;
  missing_concepts: string[];
  incorrect_statements: string[];
  feedback: string;
}

export interface SubmitQuizRequest {
  answers: QuizAttemptAnswer[];
}

export interface SubmitQuizResponse {
  evaluations: QuizEvaluation[];
}

export interface GenerateQuizResponse {
  quizId: string;
}

export interface PreviousQuizResponse {
  quiz: { id: string } | null;
}
