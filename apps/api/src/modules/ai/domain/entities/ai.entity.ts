export interface DeepDiveResult {
  explanation: string;
}

export interface QuizQuestionResult {
  questions: unknown[];
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  correct: boolean;
  explanation: string;
}

export interface KnowledgeGapResult {
  gaps: unknown[];
  recommendations: string[];
}
