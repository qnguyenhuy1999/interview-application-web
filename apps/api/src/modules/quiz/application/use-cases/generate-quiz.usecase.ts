import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { AiService } from "../../../ai/application/use-cases/ai.service";
import { GenerateQuizResult } from "../../domain/entities/quiz.entity";
import { QuizRepositoryInterface } from "../../domain/repositories/quiz-repository.interface";

@Injectable()
export class GenerateQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepositoryInterface,
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(noteId: string, userId: string): Promise<GenerateQuizResult> {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new ForbiddenException("Note not found");

    const questions = await this.aiService.generateQuiz(
      note.content,
      note.aiExplanation || note.content,
    );

    const quiz = await this.quizRepository.create({
      noteId,
      questions: { questions: questions },
    });

    return {
      quizId: quiz.id,
      questions: questions as GenerateQuizResult["questions"],
    };
  }
}
