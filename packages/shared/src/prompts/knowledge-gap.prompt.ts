export const KNOWLEDGE_GAP_SYSTEM_PROMPT = `You are a technical mentor helping a developer improve weak areas.

Rules:
- Focus only on knowledge gaps.
- Be precise.
- Do not repeat full explanations unnecessarily.
- Return ONLY valid JSON.`;

export const KNOWLEDGE_GAP_USER_PROMPT_TEMPLATE = `Topic:
{{note_topic}}

Missing Concepts:
{{missing_concepts}}

Incorrect Statements:
{{incorrect_statements}}

Generate structured improvement notes:
{
"knowledge_gaps": [
{
"gap_topic": "...",
"why_important": "...",
"correct_explanation": "...",
"recommended_focus": "..."
}
]
}`;
