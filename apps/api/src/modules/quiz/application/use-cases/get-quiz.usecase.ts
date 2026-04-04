import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { QuizRepositoryInterface } from "../../domain/repositories/quiz-repository.interface";

@Injectable()
export class GetQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  async execute(quizId: string, userId: string) {
    const quiz = await this.quizRepository.findByIdWithAttempts(quizId);
    if (!quiz) throw new NotFoundException("Quiz not found");
    const note = await this.prisma.note.findUnique({
      where: { id: quiz.noteId },
    });
    if (!note || note.userId !== userId)
      throw new ForbiddenException("Quiz not found");
    return quiz;
  }
}
