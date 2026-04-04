import {
    DEEP_DIVE_SYSTEM_PROMPT,
    DEEP_DIVE_USER_PROMPT_TEMPLATE,
    KNOWLEDGE_GAP_SYSTEM_PROMPT,
    KNOWLEDGE_GAP_USER_PROMPT_TEMPLATE,
    QUIZ_EVALUATION_SYSTEM_PROMPT,
    QUIZ_EVALUATION_USER_PROMPT_TEMPLATE,
    QUIZ_GENERATOR_SYSTEM_PROMPT,
    QUIZ_GENERATOR_USER_PROMPT_TEMPLATE,
} from "@interview-app/shared";
import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateDeepDive(noteContent: string): Promise<string> {
    const userPrompt = DEEP_DIVE_USER_PROMPT_TEMPLATE.replace(
      "{{note_content}}",
      noteContent,
    );

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DEEP_DIVE_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "";
  }

  async generateQuiz(
    noteContent: string,
    aiExplanation: string,
  ): Promise<unknown[]> {
    const userPrompt = QUIZ_GENERATOR_USER_PROMPT_TEMPLATE.replace(
      "{{note_content}}",
      noteContent,
    ).replace("{{ai_explanation}}", aiExplanation);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: QUIZ_GENERATOR_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    return parsed.questions || [];
  }

  async evaluateAnswer(
    question: Record<string, unknown>,
    userAnswer: string,
  ): Promise<Record<string, unknown>> {
    const expectedKeyPoints =
      ((question?.expectedKeyPoints ||
        question?.expected_key_points) as string[]) || [];
    const questionText = (question?.question as string) || "Unknown question";

    const userPrompt = QUIZ_EVALUATION_USER_PROMPT_TEMPLATE.replace(
      "{{question}}",
      questionText,
    )
      .replace("{{expected_key_points}}", expectedKeyPoints.join(", "))
      .replace("{{user_answer}}", userAnswer);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: QUIZ_EVALUATION_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  }

  async extractKnowledgeGaps(
    topic: string,
    missingConcepts: string[],
    incorrectStatements: string[],
  ): Promise<Record<string, unknown>> {
    const userPrompt = KNOWLEDGE_GAP_USER_PROMPT_TEMPLATE.replace(
      "{{note_topic}}",
      topic,
    )
      .replace("{{missing_concepts}}", missingConcepts.join(", "))
      .replace("{{incorrect_statements}}", incorrectStatements.join(", "));

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: KNOWLEDGE_GAP_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  }
}
