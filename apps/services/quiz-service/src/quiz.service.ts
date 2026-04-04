/**
 * MONOLITH (Before): QuizService embedded in main app
 * MICROSERVICES (After): Standalone Quiz Service calling AI service over HTTP
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QuizService {
  private readonly aiServiceUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('services.ai', 'http://localhost:3005');
  }

  async generateQuiz(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new NotFoundException('Note not found');

    const questions = await this.callAIService('/ai/generate-quiz', {
      noteContent: note.content,
      aiExplanation: note.aiExplanation || note.content,
    });

    const quiz = await this.prisma.quiz.create({
      data: { noteId, questions: { questions } as any },
    });
    return { quizId: quiz.id, questions };
  }

  async getQuiz(quizId: string, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { note: true, attempts: { orderBy: { createdAt: 'desc' } } },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.note.userId !== userId) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async getPreviousQuiz(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new NotFoundException('Note not found');

    const quiz = await this.prisma.quiz.findFirst({
      where: { noteId },
      orderBy: { createdAt: 'desc' },
      include: { attempts: { orderBy: { createdAt: 'desc' } } },
    });
    if (!quiz) return { quiz: null, message: 'No previous quiz found for this note' };
    return { quiz, message: 'Previous quiz loaded' };
  }

  async submitQuiz(
    quizId: string,
    userId: string,
    dto: { answers: { questionId: string; answer: string }[] },
  ) {
    const quiz = await this.getQuiz(quizId, userId);
    const questions = (quiz.questions as { questions: any[] }).questions;

    const evaluations = await Promise.all(
      dto.answers.map((answer, idx) => {
        const question = questions[idx] || questions.find((q: any) => q?.id === answer.questionId);
        if (!question) throw new BadRequestException('Invalid question ID');
        return this.callAIService('/ai/evaluate-answer', { question, userAnswer: answer.answer });
      }),
    );

    const avgScore = evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;
    const attempt = await this.prisma.quizAttempt.create({
      data: { quizId, answers: dto.answers as any, score: avgScore, feedback: evaluations },
    });
    return { attempt, evaluations };
  }

  private async callAIService(path: string, body: unknown): Promise<any> {
    const response = await fetch(`${this.aiServiceUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`AI service error: ${response.statusText}`);
    return response.json();
  }
}
