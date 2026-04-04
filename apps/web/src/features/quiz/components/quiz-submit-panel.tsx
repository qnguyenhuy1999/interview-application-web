"use client";

import { Button } from "@shared/components/atoms";
import { useRouter } from "next/navigation";

interface QuizSubmitPanelProps {
  quizNoteId: string;
}

export function QuizSubmitPanel({ quizNoteId }: QuizSubmitPanelProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/notes/${quizNoteId}`)}
      className="w-full sm:w-48 font-bold text-sm"
    >
      Return to Syllabus
    </Button>
  );
}
