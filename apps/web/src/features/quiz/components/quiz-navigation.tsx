"use client";

import { Button } from "@shared/components/atoms";
import { cn } from "@shared/utils";

interface QuizNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  isLastQuestion: boolean;
  viewMode: "answering" | "submitted" | "review";
  allAnswered: boolean;
  submitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onReturn: () => void;
}

export function QuizNavigation({
  currentIndex,
  totalQuestions,
  isLastQuestion,
  viewMode,
  allAnswered,
  submitting,
  onPrev,
  onNext,
  onSubmit,
  onReturn,
}: QuizNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-background/90 p-4 shadow-xl backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentIndex === 0 || submitting}
          className="w-1/3 sm:w-32 border-border/60 font-semibold"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Prev
        </Button>

        <div className="flex-1 flex justify-end">
          {isLastQuestion ? (
            viewMode === "answering" ? (
              <Button
                onClick={onSubmit}
                disabled={submitting || !allAnswered}
                className={cn(
                  "w-full sm:w-48 font-bold shadow-lg shadow-primary/25 transition-all text-sm",
                  !allAnswered && "opacity-50 grayscale cursor-not-allowed",
                )}
              >
                {submitting ? "Testing..." : "Submit Evaluation"}
                {!submitting && (
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </Button>
            ) : (
              <Button
                onClick={onReturn}
                className="w-full sm:w-48 font-bold text-sm"
              >
                Return to Syllabus
              </Button>
            )
          ) : (
            <Button
              onClick={onNext}
              disabled={submitting}
              className="w-full sm:w-32 font-bold shadow-md shadow-primary/10"
            >
              Next
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
