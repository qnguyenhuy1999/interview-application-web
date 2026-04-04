import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { GenerateQuizUseCase } from "./application/use-cases/generate-quiz.usecase";
import { GetPreviousQuizUseCase } from "./application/use-cases/get-previous-quiz.usecase";
import { GetQuizUseCase } from "./application/use-cases/get-quiz.usecase";
import { SubmitQuizUseCase } from "./application/use-cases/submit-quiz.usecase";
import { PrismaQuizRepository } from "./infrastructure/persistence/prisma-quiz.repository";
import { QuizController } from "./presentation/controllers/quiz.controller";

@Module({
  imports: [AiModule],
  controllers: [QuizController],
  providers: [
    PrismaQuizRepository,
    GenerateQuizUseCase,
    GetQuizUseCase,
    GetPreviousQuizUseCase,
    SubmitQuizUseCase,
  ],
  exports: [PrismaQuizRepository],
})
export class QuizModule {}
