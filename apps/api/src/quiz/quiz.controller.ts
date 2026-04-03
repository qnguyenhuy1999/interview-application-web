import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Controller()
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('notes/:noteId/generate-quiz')
  @UseGuards(AuthGuard('jwt'))
  generateQuiz(
    @Param('noteId') noteId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.quizService.generateQuiz(noteId, req.user.id);
  }

  @Get('quizzes/:id')
  @UseGuards(AuthGuard('jwt'))
  getQuiz(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.quizService.getQuiz(id, req.user.id);
  }

  @Get('notes/:noteId/quiz/previous')
  @UseGuards(AuthGuard('jwt'))
  getPreviousQuiz(
    @Param('noteId') noteId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.quizService.getPreviousQuiz(noteId, req.user.id);
  }

  @Post('quizzes/:id/submit')
  @UseGuards(AuthGuard('jwt'))
  submitQuiz(
    @Param('id') id: string,
    @Body() dto: SubmitQuizDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.quizService.submitQuiz(id, req.user.id, dto);
  }
}