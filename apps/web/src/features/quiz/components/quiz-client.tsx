"use client";

import { useAuthStore } from "@features/auth";
import type { Quiz, QuizEvaluation } from "@shared/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getQuiz, submitQuiz } from "../api";
import { QuizHeader } from "./quiz-header";
import { QuizNavigation } from "./quiz-navigation";
import { QuizQuestionCard } from "./quiz-question-card";

interface QuizClientProps {
  quizId: string;
  initialQuiz?: Quiz;
}

export function QuizClient({ quizId, initialQuiz }: QuizClientProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [quiz, setQuiz] = useState<Quiz | null>(initialQuiz ?? null);
  const [loading, setLoading] = useState(!initialQuiz);
  const [submitting, setSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState<
    Record<string, QuizEvaluation>
  >({});
  const [viewMode, setViewMode] = useState<
    "answering" | "submitted" | "review"
  >("answering");
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!initialQuiz && token) {
      getQuiz(quizId, token)
        .then((data) => {
          setQuiz(data);
          if (data.attempts?.length > 0) {
            const prevAnswers: Record<string, string> = {};
            const prevEvaluations: Record<string, QuizEvaluation> = {};
            data.attempts[0].answers.forEach((a) => {
              prevAnswers[a.questionId] = a.answer;
            });
            const savedFeedback = data.attempts[0].feedback as
              | QuizEvaluation[]
              | null;
            if (savedFeedback) {
              savedFeedback.forEach((ev, i) => {
                const q = data.questions.questions[i];
                if (q) {
                  const key = q.id || `q-${i}`;
                  prevEvaluations[key] = ev;
                }
              });
            }
            setAnswers(prevAnswers);
            setEvaluations(prevEvaluations);
            setViewMode("review");
          }
        })
        .catch(() => setError("Failed to load quiz"))
        .finally(() => setLoading(false));
    }
  }, [initialQuiz, token, quizId]);

  if (!initialQuiz && loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }
  if (!quiz) return <div className="p-6 text-center">Quiz not found</div>;

  const questions = quiz.questions.questions;
  const getQuestionKey = (q: (typeof questions)[0], idx: number) =>
    q.id || `q-${idx}`;
  const allAnswered = questions.every((q, idx) =>
    answers[getQuestionKey(q, idx)]?.trim(),
  );

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentQuestion = questions[currentIndex];
  const questionKey = getQuestionKey(currentQuestion, currentIndex);

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);

    try {
      const answerList = questions
        .map((q, idx) => {
          const questionId = getQuestionKey(q, idx);
          return { questionId, answer: answers[questionId] || "" };
        })
        .filter((entry) => entry.answer.trim().length > 0);

      const result = await submitQuiz(quizId, answerList, token);

      const evalMap: Record<string, QuizEvaluation> = {};
      result.evaluations.forEach((ev: QuizEvaluation, i: number) => {
        const q = questions[i];
        if (q) evalMap[getQuestionKey(q, i)] = ev;
      });
      setEvaluations(evalMap);
      setViewMode("submitted");
      setCurrentIndex(0);
    } catch {
      setError("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in pb-32 pt-6 sm:pt-10">
      {/* Top Header & Progress Bar */}
      <QuizHeader
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        viewMode={viewMode}
      />

      {error && (
        <p className="text-sm text-destructive font-bold p-4 bg-destructive/10 rounded-xl">
          {error}
        </p>
      )}

      {/* Center Stage Card Container */}
      <div className="min-h-100">
        <div key={questionKey} className="animate-fade-in-up">
          <QuizQuestionCard
            question={currentQuestion}
            index={currentIndex}
            answer={answers[questionKey]}
            evaluation={evaluations[questionKey]}
            viewMode={viewMode}
            onAnswerChange={(key, value) => {
              setError(null);
              setAnswers((prev) => ({ ...prev, [key]: value }));
            }}
          />
        </div>
      </div>

      {/* Sticky Bottom Context / Navigation */}
      <QuizNavigation
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        isLastQuestion={isLastQuestion}
        viewMode={viewMode}
        allAnswered={allAnswered}
        submitting={submitting}
        onPrev={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        onNext={() =>
          setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
        }
        onSubmit={handleSubmit}
        onReturn={() => router.push(`/notes/${quiz.note.id}`)}
      />
    </div>
  );
}
