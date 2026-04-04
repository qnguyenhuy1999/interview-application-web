"use client";

import { Badge, Textarea } from "@shared/components/atoms";
import type { QuizEvaluation, QuizQuestion } from "@shared/types";
import { cn } from "@shared/utils";
import { QuestionEvaluation } from "./question-evaluation";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  answer?: string;
  evaluation?: QuizEvaluation;
  viewMode: "answering" | "submitted" | "review";
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
    easy: "success",
    medium: "warning",
    hard: "error",
  };

  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="space-y-8">
      {/* Question Header */}
      <div className="mb-6 flex flex-col gap-3">
        <Badge
          variant={
            difficultyColors[question.difficulty] as
              | "success"
              | "warning"
              | "error"
          }
          className="w-fit text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 shadow-sm"
        >
          {question.difficulty}
        </Badge>
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl lg:leading-[1.4] text-foreground">
          {question.question}
        </h3>
      </div>

      {/* Multiple Choice Hit-Cards */}
      {question.type === "multiple_choice" && question.options && (
        <div className="space-y-3">
          {question.options.map((opt, i) => {
            const isSelected = answer === opt;
            const letter = letters[i] || i + 1;
            const isReview = viewMode !== "answering";

            return (
              <label
                key={`${questionKey}-opt-${i}`}
                className={cn(
                  "group flex w-full cursor-pointer items-start sm:items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ease-out",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/5 scale-[1.01]"
                    : "border-border/50 bg-card hover:border-primary/40 hover:bg-muted/30",
                  isReview &&
                    "cursor-default hover:border-border/50 hover:bg-card scale-100",
                  isReview &&
                    isSelected &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-bold shadow-sm transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground group-hover:border-primary/40",
                    isReview &&
                      !isSelected &&
                      "bg-muted border-muted-foreground/20",
                  )}
                >
                  {isSelected && viewMode !== "answering" ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    letter
                  )}
                </div>

                <input
                  type="radio"
                  name={questionKey}
                  value={opt}
                  checked={isSelected}
                  onChange={(e) => onAnswerChange(questionKey, e.target.value)}
                  disabled={isReview}
                  className="hidden"
                />
                <span
                  className={cn(
                    "text-base font-medium leading-relaxed",
                    isSelected
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                    isReview && !isSelected && "opacity-60",
                  )}
                >
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Open Ended Textarea */}
      {(question.type === "open_ended" || question.type === "scenario_based") &&
        (viewMode === "answering" ? (
          <div className="relative">
            <Textarea
              value={answer || ""}
              onChange={(e) => onAnswerChange(questionKey, e.target.value)}
              rows={6}
              placeholder="Type your explanation here. The AI will evaluate your technical precision..."
              className="min-h-40 resize-none rounded-2xl border-2 p-5 text-base shadow-sm transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary bg-card/60 backdrop-blur-sm placeholder:text-muted-foreground/60"
            />
            {answer && answer.length > 0 && (
              <div className="absolute right-3 bottom-3 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                {answer.split(" ").length} words
              </div>
            )}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card p-6 shadow-sm">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Your Answer
            </div>
            <p className="whitespace-pre-wrap text-base font-medium leading-relaxed opacity-90">
              {answer || (
                <span className="italic text-muted-foreground">
                  No answer provided.
                </span>
              )}
            </p>
          </div>
        ))}

      {/* AI Evaluation Feedback Block */}
      {viewMode !== "answering" && evaluation && (
        <QuestionEvaluation evaluation={evaluation} />
      )}
    </div>
  );
}
