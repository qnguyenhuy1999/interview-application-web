'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  topic?: string;
  content: string;
  aiExplanation?: string;
  createdAt: string;
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = () => {
    if (!token) return;
    apiRequest<Note>(`/notes/${noteId}`, { token })
      .then(setNote)
      .catch(() => setError('Failed to load note'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNote();
  }, [token, noteId]);

  const handleDeepDive = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      await apiRequest(`/notes/${noteId}/deep-dive`, {
        method: 'POST',
        token,
      });
      fetchNote();
    } catch {
      setError('Failed to generate deep dive');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!token) return;
    setQuizLoading(true);
    try {
      const result = await apiRequest<{ quizId: string }>(`/notes/${noteId}/generate-quiz`, {
        method: 'POST',
        token,
      });
      router.push(`/quiz/${result.quizId}`);
    } catch {
      setError('Failed to generate quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleLoadPreviousQuiz = async () => {
    if (!token) return;
    setQuizLoading(true);
    try {
      const result = await apiRequest<{ quiz: { id: string } | null }>(`/notes/${noteId}/quiz/previous`, {
        method: 'GET',
        token,
      });
      if (result.quiz) {
        router.push(`/quiz/${result.quiz.id}`);
      }
    } catch {
      setError('Failed to load previous quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!note) return <div className="p-6">Note not found</div>;

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button onClick={() => router.back()} className="mb-2 text-sm text-muted-foreground hover:underline">
              ← Back
            </button>
            <h1 className="text-2xl font-bold">{note.title}</h1>
            {note.topic && (
              <span className="mt-1 block text-sm text-muted-foreground">{note.topic}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/notes/${noteId}/edit`)}
            className="shrink-0 sm:self-start"
          >
            Edit
          </Button>
        </div>

        {/* Note Content */}
        <div className="rounded-lg border p-4 sm:p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Note</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
        </div>

        {/* AI Deep Dive */}
        <div className="rounded-lg border p-4 sm:p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">AI Deep Dive</h2>
          {note.aiExplanation ? (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Generated</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.aiExplanation}</p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                Expand your note into a structured, senior-level explanation.
              </p>
              <Button onClick={handleDeepDive} disabled={aiLoading}>
                {aiLoading ? 'Generating...' : 'Generate Deep Dive'}
              </Button>
            </div>
          )}
        </div>

        {/* Quiz Actions */}
        <div className="rounded-lg border p-4 sm:p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Quiz</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button onClick={handleGenerateQuiz} disabled={quizLoading}>
              {quizLoading ? 'Loading...' : 'Generate New Quiz'}
            </Button>
            <Button variant="secondary" onClick={handleLoadPreviousQuiz} disabled={quizLoading}>
              Load Previous Quiz
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}