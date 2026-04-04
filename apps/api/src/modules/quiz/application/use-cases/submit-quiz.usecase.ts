import { BadRequestException, Injectable } from "@nestjs/common";
import { AiService } from "../../../ai/application/use-cases/ai.service";
import {
    QuizEvaluation,
    SubmitQuizResult,
} from "../../domain/entities/quiz.entity";
import { QuizRepositoryInterface } from "../../domain/repositories/quiz-repository.interface";
import { SubmitQuizDto } from "../../dto";

@Injectable()
export class SubmitQuizUseCase {
  constructor(
    private readonly quizRepository: QuizRepositoryInterface,
    private readonly aiService: AiService,
  ) {}

  private resolveQuestion(
    questions: unknown[],
    questionId: string,
    answerIndex: number,
  ): unknown {
    const byId = questions.find(
      (q: unknown) => (q as Record<string, unknown>)?.id === questionId,
    );
    if (byId) return byId;

    const indexMatch = /^q-(\d+)$/.exec(questionId);
    if (indexMatch) {
      const parsedIndex = Number(indexMatch[1]);
      return questions[parsedIndex];
    }

    return questions[answerIndex];
  }

  async execute(
    quizId: string,
    _userId: string,
    dto: SubmitQuizDto,
  ): Promise<SubmitQuizResult> {
    const quiz = await this.quizRepository.findByIdWithAttempts(quizId);
    if (!quiz) throw new BadRequestException("Quiz not found");

    const questions = (quiz.questions as { questions: unknown[] }).questions;

    const evaluations = (await Promise.all(
      dto.answers.map((answer, answerIndex) => {
        const question = this.resolveQuestion(
          questions,
          answer.questionId,
          answerIndex,
        );
        if (!question) {
          throw new BadRequestException("Invalid quiz answer questionId");
        }
        return this.aiService.evaluateAnswer(
          question as Record<string, unknown>,
          answer.answer,
        );
      }),
    )) as unknown as QuizEvaluation[];

    const avgScore =
      evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;

    const attempt = await this.quizRepository.createAttempt({
      quizId,
      answers: dto.answers as unknown[],
      score: avgScore,
      feedback: evaluations,
    });

    return { attempt, evaluations };
  }
}
