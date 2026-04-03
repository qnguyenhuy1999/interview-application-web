import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { PrismaService } from "../prisma/prisma.service";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async generateQuiz(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new NotFoundException("Note not found");

    const questions = await this.aiService.generateQuiz(
      note.content,
      note.aiExplanation || note.content,
    );

    const quiz = await this.prisma.quiz.create({
      data: { noteId, questions: { questions } as any },
    });

    return { quizId: quiz.id, questions };
  }

  async getQuiz(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        note: true,
        attempts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!quiz) throw new NotFoundException("Quiz not found");
    if (quiz.note.userId !== userId)
      throw new NotFoundException("Quiz not found");
    return quiz;
  }

  async getPreviousQuiz(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new NotFoundException("Note not found");

    const quiz = await this.prisma.quiz.findFirst({
      where: { noteId },
      orderBy: { createdAt: "desc" },
      include: {
        attempts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!quiz) {
      return { quiz: null, message: "No previous quiz found for this note" };
    }

    return { quiz, message: "Previous quiz loaded" };
  }

  async submitQuiz(quizId: string, userId: string, dto: SubmitQuizDto) {
    const quiz = await this.getQuiz(quizId, userId);
    const questions = (quiz.questions as { questions: any[] }).questions;

    const resolveQuestion = (questionId: string, answerIndex: number) => {
      const byId = questions.find((q) => q?.id === questionId);
      if (byId) return byId;

      const indexMatch = /^q-(\d+)$/.exec(questionId);
      if (indexMatch) {
        const parsedIndex = Number(indexMatch[1]);
        return questions[parsedIndex];
      }

      return questions[answerIndex];
    };

    const evaluations = await Promise.all(
      dto.answers.map((answer, answerIndex) => {
        const question = resolveQuestion(answer.questionId, answerIndex);
        if (!question) {
          throw new BadRequestException("Invalid quiz answer questionId");
        }

        return this.aiService.evaluateAnswer(question, answer.answer);
      }),
    );

    const avgScore =
      evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        answers: dto.answers as any,
        score: avgScore,
        feedback: evaluations,
      },
    });

    return { attempt, evaluations };
  }
}
