"use client";

import type { QuizEvaluation } from "@shared/types";
import { cn } from "@shared/utils";

interface QuestionEvaluationProps {
  evaluation: QuizEvaluation;
}

export function QuestionEvaluation({ evaluation }: QuestionEvaluationProps) {
  const scoreBg = (score: number) => {
    if (score >= 8)
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200";
    if (score >= 5)
      return "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200";
    return "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200";
  };

  const scoreBadgeIcon = (score: number) => {
    if (score >= 8) return "🌟";
    if (score >= 5) return "⚠️";
    return "🔴";
  };

  return (
    <div
      className={cn(
        "mt-8 rounded-2xl border-2 p-6 animate-fade-in shadow-sm",
        scoreBg(evaluation.score),
      )}
    >
      <div className="flex items-center gap-2 font-bold text-lg mb-3">
        <span>
          {scoreBadgeIcon(evaluation.score)} AI Evaluation Score:{" "}
          {evaluation.score}/10
        </span>
      </div>

      {evaluation.feedback && (
        <p className="mt-2 leading-relaxed opacity-90 text-[15px]">
          {evaluation.feedback}
        </p>
      )}

      {evaluation.missing_concepts &&
        evaluation.missing_concepts.length > 0 && (
          <div className="mt-5 rounded-xl bg-background/50 p-4 border border-current-10 backdrop-blur-sm">
            <span className="font-bold block mb-1">Key Concepts Missing:</span>
            <ul className="list-inside list-disc opacity-90 space-y-1">
              {evaluation.missing_concepts.map((concept, idx) => (
                <li key={idx}>{concept}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
