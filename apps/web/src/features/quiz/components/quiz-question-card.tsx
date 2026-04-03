'use client';

import { Button } from '@shared/components/atoms';
import { Badge } from '@shared/components/atoms';
import { Textarea } from '@shared/components/atoms';
import type { QuizQuestion, QuizEvaluation } from '@shared/types';
import { cn } from '@shared/utils';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  answer?: string;
  evaluation?: QuizEvaluation;
  viewMode: 'answering' | 'submitted' | 'review';
  onAnswerChange: (questionKey: string, value: string) => void;
}

export function QuizQuestionCard({
  question,
  index,
  answer,
  evaluation,
  viewMode,
  onAnswerChange,
}: QuizQuestionCardProps) {
  const questionKey = question.id || `q-${index}`;
  const difficultyColors: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  };

  const scoreBg = (score: number) => {
    if (score >= 7) return 'bg-green-50 border-green-200';
    if (score >= 4) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="rounded-lg border p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <h3 className="font-medium text-sm sm:text-base">
          Q{index + 1}. {question.question}
        </h3>
        <Badge variant={difficultyColors[question.difficulty] as 'success' | 'warning' | 'error'}>
          {question.difficulty}
        </Badge>
      </div>

      {question.type === 'multiple_choice' && question.options && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <label
              key={`${questionKey}-opt-${i}`}
              className="flex items-start gap-2 rounded border p-2 hover:bg-accent/50 cursor-pointer"
            >
              <input
                type="radio"
                name={questionKey}
                value={opt}
                checked={answer === opt}
                onChange={(e) => onAnswerChange(questionKey, e.target.value)}
                disabled={viewMode !== 'answering'}
                className="mt-0.5 shrink-0"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {(question.type === 'open_ended' || question.type === 'scenario_based') && (
        <Textarea
          value={answer || ''}
          onChange={(e) => onAnswerChange(questionKey, e.target.value)}
          disabled={viewMode !== 'answering'}
          rows={4}
          placeholder="Type your answer here..."
        />
      )}

      {viewMode !== 'answering' && evaluation && (
        <div className={cn('mt-3 rounded-md border p-3 text-sm', scoreBg(evaluation.score))}>
          <div className="font-semibold">
            Score: {evaluation.score}/10
          </div>
          {evaluation.feedback && (
            <p className="mt-1 text-muted-foreground">{evaluation.feedback}</p>
          )}
          {evaluation.missing_concepts?.length > 0 && (
            <div className="mt-2">
              <span className="font-medium text-red-700">Missing: </span>
              <span className="text-muted-foreground">
                {evaluation.missing_concepts.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
