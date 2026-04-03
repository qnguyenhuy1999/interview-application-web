export const QUIZ_GENERATOR_SYSTEM_PROMPT = `You are a Senior Technical Interviewer.

Generate high-quality interview questions.

Rules:
- Questions must test deep understanding.
- Avoid trivial or memorization-only questions.
- Include scenario-based questions.
- At least one hard-difficulty question.
- Return ONLY valid JSON.
- Do not include explanations outside JSON.`;

export const QUIZ_GENERATOR_USER_PROMPT_TEMPLATE = `Topic:
{{note_content}}

Explanation:
{{ai_explanation}}

Generate 5 questions in this JSON format:
{
"questions": [
{
"type": "multiple_choice",
"question": "...",
"options": ["A", "B", "C", "D"],
"correct_answer": "B",
"difficulty": "medium"
},
{
"type": "open_ended",
"question": "...",
"expected_key_points": ["point1", "point2"],
"difficulty": "hard"
}
]
}

Rules:
- At least 2 scenario-based questions.
- At least 1 hard-difficulty question.
- No duplicate concepts.
- Ensure JSON is valid.`;
