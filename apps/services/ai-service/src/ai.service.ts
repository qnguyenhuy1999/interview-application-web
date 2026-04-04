/**
 * MONOLITH (Before): AiService called as in-process NestJS service
 * MICROSERVICES (After): Standalone AI Service with Redis caching and retry
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEEP_DIVE_SYSTEM_PROMPT,
  DEEP_DIVE_USER_PROMPT_TEMPLATE,
  KNOWLEDGE_GAP_SYSTEM_PROMPT,
  KNOWLEDGE_GAP_USER_PROMPT_TEMPLATE,
  QUIZ_EVALUATION_SYSTEM_PROMPT,
  QUIZ_EVALUATION_USER_PROMPT_TEMPLATE,
  QUIZ_GENERATOR_SYSTEM_PROMPT,
  QUIZ_GENERATOR_USER_PROMPT_TEMPLATE,
} from '@interview-app/shared';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateDeepDive(noteContent: string) {
    const cacheKey = `ai:deepdive:${this.hash(noteContent)}`;
    // TODO: Check Redis cache, return if HIT
    const userPrompt = DEEP_DIVE_USER_PROMPT_TEMPLATE.replace('{{note_content}}', noteContent);
    const result = await this.withRetry(() =>
      this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: DEEP_DIVE_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    );
    const content = result.choices[0]?.message?.content || '';
    // TODO: Store in Redis cache (TTL: 1 hour)
    return content;
  }

  async generateQuiz(noteContent: string, aiExplanation: string) {
    const userPrompt = QUIZ_GENERATOR_USER_PROMPT_TEMPLATE
      .replace('{{note_content}}', noteContent)
      .replace('{{ai_explanation}}', aiExplanation);
    const result = await this.withRetry(() =>
      this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: QUIZ_GENERATOR_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    );
    const content = result.choices[0]?.message?.content || '{}';
    return JSON.parse(content).questions || [];
  }

  async evaluateAnswer(question: unknown, userAnswer: string) {
    const q = question as { question?: string; expectedKeyPoints?: string[]; expected_key_points?: string[] };
    const expectedKeyPoints = q?.expectedKeyPoints || q?.expected_key_points || [];
    const questionText = q?.question || 'Unknown question';
    const userPrompt = QUIZ_EVALUATION_USER_PROMPT_TEMPLATE
      .replace('{{question}}', questionText)
      .replace('{{expected_key_points}}', expectedKeyPoints.join(', '))
      .replace('{{user_answer}}', userAnswer);
    const result = await this.withRetry(() =>
      this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: QUIZ_EVALUATION_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    );
    const content = result.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.maxRetries - 1) {
          await this.sleep(this.baseDelay * Math.pow(2, attempt));
        }
      }
    }
    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private hash(content: string): string {
    // Simple hash for cache key — replace with crypto.createHash in production
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash.toString(36);
  }
}
