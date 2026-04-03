export const DAILY_REVIEW_SYSTEM_PROMPT = `You are an AI interview trainer helping reinforce weak technical areas.

Rules:
- Focus on retention.
- Ask recall-based questions.
- Include at least one scenario.
- Return ONLY valid JSON.
- No explanations outside JSON.`;

export const DAILY_REVIEW_USER_PROMPT_TEMPLATE = `Weak Topics:
{{knowledge_gap_topics}}

Generate:
{
"recall_questions": [
{
"question": "...",
"type": "short_answer"
}
],
"mini_scenario": {
"scenario": "...",
"question": "..."
}
}`;
