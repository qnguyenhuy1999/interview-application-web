'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'open_ended';
  question: string;
  options?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizAttempt {
  id: string;
  answers: { questionId: string; answer: string }[];
  score: number;
  createdAt: string;
}

interface Quiz {
  id: string;
  questions: { questions: QuizQuestion[] };
  attempts: QuizAttempt[];
  note: { id: string; title: string };
}

interface QuizEvaluation {
  score: number;
  missing_concepts: string[];
  incorrect_statements: string[];
  feedback: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<string, QuizEvaluation>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) return;
    apiRequest<Quiz>(`/quizzes/${quizId}`, { token })
      .then(setQuiz)
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [token, quizId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!quiz) return <div className="p-6">Quiz not found</div>;

  const questions = quiz.questions.questions;
  const attempts = quiz.attempts || [];

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);

    try {
      const answerList = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const result = await apiRequest<{ evaluations: QuizEvaluation[] }>(
        `/quizzes/${quizId}/submit`,
        { method: 'POST', body: { answers: answerList }, token }
      );

      const evalMap: Record<string, QuizEvaluation> = {};
      result.evaluations.forEach((ev: QuizEvaluation, i: number) => {
        const q = questions[i];
        if (q) evalMap[q.id] = ev;
      });
      setEvaluations(evalMap);
      setSubmitted(true);
    } catch {
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToNote = () => {
    router.push(`/notes/${quiz.note.id}`);
  };

  const difficultyColor = (d: string) => {
    if (d === 'hard') return 'bg-red-100 text-red-700';
    if (d === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const evalBg = (score: number) => {
    if (score >= 7) return 'bg-green-50 border-green-200';
    if (score >= 4) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={handleBackToNote}
            className="mb-2 text-sm text-muted-foreground hover:underline"
          >
            ← Back to note
          </button>
          <h1 className="text-xl font-bold sm:text-2xl">Quiz: {quiz.note.title}</h1>
          {attempts.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {attempts.length} previous attempt{attempts.length !== 1 ? 's' : ''} — Latest score:{' '}
              {attempts[0].score.toFixed(1)}/10
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-lg border p-4 sm:p-5">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                <h3 className="font-medium text-sm sm:text-base">
                  Q{idx + 1}. {q.question}
                </h3>
                <span className={`self-start rounded-full px-2 py-0.5 text-xs ${difficultyColor(q.difficulty)}`}>
                  {q.difficulty}
                </span>
              </div>

              {q.type === 'multiple_choice' && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="flex items-start gap-2 rounded border p-2 hover:bg-accent/50 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        disabled={submitted}
                        className="mt-0.5 shrink-0"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'open_ended' && (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  disabled={submitted}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Type your answer here..."
                />
              )}

              {/* Evaluation result */}
              {submitted && evaluations[q.id] && (
                <div className={`mt-3 rounded-md border p-3 text-sm ${evalBg(evaluations[q.id].score)}`}>
                  <div className="font-semibold">
                    Score: {evaluations[q.id].score}/10
                  </div>
                  {evaluations[q.id].feedback && (
                    <p className="mt-1 text-muted-foreground">{evaluations[q.id].feedback}</p>
                  )}
                  {evaluations[q.id].missing_concepts?.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium text-red-700">Missing: </span>
                      <span className="text-muted-foreground">
                        {evaluations[q.id].missing_concepts.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                Object.keys(answers).length !== questions.length
              }
              className="w-full sm:w-auto"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={() => router.push(`/notes/${quiz.note.id}`)} className="w-full sm:w-auto">
              Back to Note
            </Button>
          )}
          <Button variant="outline" onClick={handleBackToNote} className="w-full sm:w-auto">
            Back
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
