'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { Button, Badge } from '@shared/components/atoms';
import { PageContainer, PageHeader } from '@shared/components/templates';
import { useAuthStore } from '@features/auth';
import { getNote, deepDiveNote, generateQuiz, loadPreviousQuiz } from '@features/notes/api';
import type { Note } from '@features/notes/types';

const ReactMarkdown = dynamic(
  () => import('react-markdown').then((m) => m.default),
  { ssr: false },
);

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

  const fetchNote = useCallback(() => {
    if (!token) return;
    getNote(noteId, token)
      .then(setNote)
      .catch(() => setError('Failed to load note'))
      .finally(() => setLoading(false));
  }, [token, noteId]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const handleDeepDive = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      await deepDiveNote(noteId, token);
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
      const result = await generateQuiz(noteId, token);
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
      const result = await loadPreviousQuiz(noteId, token);
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
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={note.title}
          description={note.topic}
          backHref="/notes"
          actions={
            <Button variant="outline" size="sm" onClick={() => router.push(`/notes/${noteId}/edit`)}>
              Edit
            </Button>
          }
        />

        {/* Note Content */}
        <div className="rounded-lg border p-4 sm:p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Note</h2>
          <div className="prose prose-sm dark:prose-invert prose-neutral max-w-none text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
          </div>
        </div>

        {/* AI Deep Dive */}
        <div className="rounded-lg border p-4 sm:p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">AI Deep Dive</h2>
          {note.aiExplanation ? (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="success">Generated</Badge>
              </div>
              <div className="prose prose-sm dark:prose-invert prose-neutral max-w-none text-muted-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.aiExplanation}</ReactMarkdown>
              </div>
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
            {note.hasQuiz && (
              <Button variant="secondary" onClick={handleLoadPreviousQuiz} disabled={quizLoading}>
                Load Previous Quiz
              </Button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </PageContainer>
  );
}
