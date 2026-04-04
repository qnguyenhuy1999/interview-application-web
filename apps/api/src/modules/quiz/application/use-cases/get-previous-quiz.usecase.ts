import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { QuizRepositoryInterface } from "../../domain/repositories/quiz-repository.interface";

@Injectable()
export class GetPreviousQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepositoryInterface,
    private readonly prisma: PrismaService,
  ) {}

  async execute(noteId: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new ForbiddenException("Note not found");

    const quiz =
      await this.quizRepository.findFirstByNoteIdWithAttempts(noteId);
    if (!quiz) {
      return { quiz: null, message: "No previous quiz found for this note" };
    }
    return { quiz, message: "Previous quiz loaded" };
  }
}
