"use client";

import { cn } from "@shared/utils";

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  viewMode: "answering" | "submitted" | "review";
}

export function QuizHeader({
  currentIndex,
  totalQuestions,
  viewMode,
}: QuizHeaderProps) {
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="sticky top-18 z-20 -mx-4 mb-8 bg-background/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 shadow-sm border-b border-border/40">
      <div className="mb-3 flex items-center justify-between text-sm font-bold text-muted-foreground uppercase tracking-wider">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        {viewMode !== "answering" && (
          <span className="text-primary tracking-normal font-bold">
            Review Mode
          </span>
        )}
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50 border border-border/50 inner-shadow-sm">
        <div
          className={cn(
            "h-full transition-all duration-700 ease-out",
            viewMode === "answering" ? "bg-primary" : "bg-emerald-500",
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
