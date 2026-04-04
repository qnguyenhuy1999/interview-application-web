/**
 * MONOLITH (Before): QuizController embedded in main app
 * MICROSERVICES (After): Standalone Quiz Service controller
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Controller, Get, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizService } from './quiz.service';

@Controller()
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('notes/:noteId/generate-quiz')
  @UseGuards(AuthGuard('jwt'))
  generateQuiz(@Headers('x-user-id') userId: string, @Param('noteId') noteId: string) {
    return this.quizService.generateQuiz(noteId, userId);
  }

  @Get('quizzes/:id')
  @UseGuards(AuthGuard('jwt'))
  getQuiz(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.quizService.getQuiz(id, userId);
  }

  @Get('notes/:noteId/quiz/previous')
  @UseGuards(AuthGuard('jwt'))
  getPreviousQuiz(@Headers('x-user-id') userId: string, @Param('noteId') noteId: string) {
    return this.quizService.getPreviousQuiz(noteId, userId);
  }

  @Post('quizzes/:id/submit')
  @UseGuards(AuthGuard('jwt'))
  submitQuiz(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() body: { answers: { questionId: string; answer: string }[] },
  ) {
    return this.quizService.submitQuiz(id, userId, body);
  }
}
