'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@features/auth';
import { getQuiz, submitQuiz } from '../api';
import { QuizQuestionCard } from './quiz-question-card';
import { Button } from '@shared/components/atoms';
import type { Quiz, QuizEvaluation } from '@shared/types';

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
  const [evaluations, setEvaluations] = useState<Record<string, QuizEvaluation>>({});
  const [viewMode, setViewMode] = useState<'answering' | 'submitted' | 'review'>('answering');
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
            const savedFeedback = data.attempts[0].feedback as QuizEvaluation[] | null;
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
            setViewMode('review');
          }
        })
        .catch(() => setError('Failed to load quiz'))
        .finally(() => setLoading(false));
    }
  }, [initialQuiz, token, quizId]);

  if (!initialQuiz && loading) return <div className="p-6">Loading...</div>;
  if (!quiz) return <div className="p-6">Quiz not found</div>;

  const questions = quiz.questions.questions;
  const attempts = quiz.attempts || [];
  const getQuestionKey = (q: typeof questions[0], idx: number) => q.id || `q-${idx}`;
  const allAnswered = questions.every((q, idx) =>
    answers[getQuestionKey(q, idx)]?.trim(),
  );

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);

    try {
      const answerList = questions
        .map((q, idx) => {
          const questionId = getQuestionKey(q, idx);
          return { questionId, answer: answers[questionId] || '' };
        })
        .filter((entry) => entry.answer.trim().length > 0);

      const result = await submitQuiz(quizId, answerList, token);

      const evalMap: Record<string, QuizEvaluation> = {};
      result.evaluations.forEach((ev: QuizEvaluation, i: number) => {
        const q = questions[i];
        if (q) evalMap[getQuestionKey(q, i)] = ev;
      });
      setEvaluations(evalMap);
      setViewMode('submitted');
    } catch {
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {questions.map((q, idx) => {
        const questionKey = getQuestionKey(q, idx);
        return (
          <QuizQuestionCard
            key={questionKey}
            question={q}
            index={idx}
            answer={answers[questionKey]}
            evaluation={evaluations[questionKey]}
            viewMode={viewMode}
            onAnswerChange={(key, value) =>
              setAnswers((prev) => ({ ...prev, [key]: value }))
            }
          />
        );
      })}

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {viewMode === 'answering' ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            className="w-full sm:w-auto"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/notes/${quiz.note.id}`)}
            className="w-full sm:w-auto"
          >
            Back to Note
          </Button>
        )}
        {viewMode === 'answering' && (
          <Button
            variant="outline"
            onClick={() => router.push(`/notes/${quiz.note.id}`)}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
