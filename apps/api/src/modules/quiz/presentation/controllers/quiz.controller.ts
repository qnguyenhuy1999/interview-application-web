import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../../../common/pipes/zod-validation.pipe";
import { GenerateQuizUseCase } from "../../application/use-cases/generate-quiz.usecase";
import { GetPreviousQuizUseCase } from "../../application/use-cases/get-previous-quiz.usecase";
import { GetQuizUseCase } from "../../application/use-cases/get-quiz.usecase";
import { SubmitQuizUseCase } from "../../application/use-cases/submit-quiz.usecase";
import {
    noteIdParamSchema,
    quizIdParamSchema,
    SubmitQuizDto,
    submitQuizSchema,
} from "../../dto";

@Controller()
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(
    private readonly generateQuizUseCase: GenerateQuizUseCase,
    private readonly getQuizUseCase: GetQuizUseCase,
    private readonly getPreviousQuizUseCase: GetPreviousQuizUseCase,
    private readonly submitQuizUseCase: SubmitQuizUseCase,
  ) {}

  @Post("notes/:noteId/generate-quiz")
  generateQuiz(
    @Param(new ZodValidationPipe(noteIdParamSchema))
    { noteId }: { noteId: string },
    @CurrentUser("id") userId: string,
  ) {
    return this.generateQuizUseCase.execute(noteId, userId);
  }

  @Get("quizzes/:id")
  getQuiz(
    @Param(new ZodValidationPipe(quizIdParamSchema)) { id }: { id: string },
    @CurrentUser("id") userId: string,
  ) {
    return this.getQuizUseCase.execute(id, userId);
  }

  @Get("notes/:noteId/quiz/previous")
  getPreviousQuiz(
    @Param(new ZodValidationPipe(noteIdParamSchema))
    { noteId }: { noteId: string },
    @CurrentUser("id") userId: string,
  ) {
    return this.getPreviousQuizUseCase.execute(noteId, userId);
  }

  @Post("quizzes/:id/submit")
  submitQuiz(
    @Param(new ZodValidationPipe(quizIdParamSchema)) { id }: { id: string },
    @CurrentUser("id") userId: string,
    @Body(new ZodValidationPipe(submitQuizSchema)) dto: SubmitQuizDto,
  ) {
    return this.submitQuizUseCase.execute(id, userId, dto);
  }
}
