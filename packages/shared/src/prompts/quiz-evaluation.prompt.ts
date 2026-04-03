export const QUIZ_EVALUATION_SYSTEM_PROMPT = `You are a strict Senior Technical Interviewer.

Evaluate answers critically.

Rules:
- Be objective.
- Do not over-score.
- Identify missing concepts.
- Identify incorrect statements.
- Return ONLY valid JSON.
- Do not include explanations outside JSON.`;

export const QUIZ_EVALUATION_USER_PROMPT_TEMPLATE = `Question:
{{question}}

Expected Key Points:
{{expected_key_points}}

User Answer:
{{user_answer}}

Evaluate using this JSON format:
{
"score": 0-10,
"missing_concepts": ["concept1", "concept2"],
"incorrect_statements": ["statement1"],
"feedback": "Short constructive feedback"
}`;
