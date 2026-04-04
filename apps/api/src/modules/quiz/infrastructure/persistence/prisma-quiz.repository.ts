import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { Quiz, QuizAttempt } from "../../domain/entities/quiz.entity";
import { QuizRepositoryInterface } from "../../domain/repositories/quiz-repository.interface";

@Injectable()
export class PrismaQuizRepository implements QuizRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    noteId: string;
    questions: { questions: unknown[] };
  }): Promise<Quiz> {
    return this.prisma.quiz.create({
      data: {
        noteId: data.noteId,
        questions: data.questions as any,
      },
    }) as unknown as Promise<Quiz>;
  }

  async findById(id: string): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: { id },
    }) as unknown as Promise<Quiz | null>;
  }

  async findFirstByNoteId(noteId: string): Promise<Quiz | null> {
    return this.prisma.quiz.findFirst({
      where: { noteId },
      orderBy: { createdAt: "desc" },
    }) as unknown as Promise<Quiz | null>;
  }

  async createAttempt(data: {
    quizId: string;
    answers: unknown[];
    score: number;
    feedback: unknown[];
  }): Promise<QuizAttempt> {
    return this.prisma.quizAttempt.create({
      data: {
        quizId: data.quizId,
        answers: data.answers as any,
        score: data.score,
        feedback: data.feedback as any,
      },
    }) as unknown as Promise<QuizAttempt>;
  }

  async findByIdWithAttempts(id: string): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: { attempts: { orderBy: { createdAt: "desc" } } },
    }) as unknown as Promise<Quiz | null>;
  }

  async findFirstByNoteIdWithAttempts(noteId: string): Promise<Quiz | null> {
    return this.prisma.quiz.findFirst({
      where: { noteId },
      orderBy: { createdAt: "desc" },
      include: { attempts: { orderBy: { createdAt: "desc" } } },
    }) as unknown as Promise<Quiz | null>;
  }
}
