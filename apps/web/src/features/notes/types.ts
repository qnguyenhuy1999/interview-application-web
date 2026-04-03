export interface Note {
  id: string;
  title: string;
  topic?: string;
  content: string;
  aiExplanation?: string;
  hasQuiz?: boolean;
  createdAt: string;
}