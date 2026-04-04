/**
 * MONOLITH (Before): AiService used as internal dependency
 * MICROSERVICES (After): AI Service exposes HTTP endpoints for other services
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-quiz')
  async generateQuiz(@Body() body: { noteContent: string; aiExplanation: string }) {
    return this.aiService.generateQuiz(body.noteContent, body.aiExplanation);
  }

  @Post('deep-dive')
  async deepDive(@Body() body: { noteContent: string }) {
    return this.aiService.generateDeepDive(body.noteContent);
  }

  @Post('evaluate-answer')
  async evaluateAnswer(@Body() body: { question: unknown; userAnswer: string }) {
    return this.aiService.evaluateAnswer(body.question, body.userAnswer);
  }
}
