import { Quiz, QuizAttempt } from "../entities/quiz.entity";

export interface QuizRepositoryInterface {
  create(data: {
    noteId: string;
    questions: { questions: unknown[] };
  }): Promise<Quiz>;
  findById(id: string): Promise<Quiz | null>;
  findFirstByNoteId(noteId: string): Promise<Quiz | null>;
  createAttempt(data: {
    quizId: string;
    answers: unknown[];
    score: number;
    feedback: unknown[];
  }): Promise<QuizAttempt>;
  findByIdWithAttempts(id: string): Promise<Quiz | null>;
  findFirstByNoteIdWithAttempts(noteId: string): Promise<Quiz | null>;
}
