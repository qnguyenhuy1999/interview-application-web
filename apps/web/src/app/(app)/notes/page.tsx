'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';

interface Note {
  id: string;
  title: string;
  topic?: string;
  content: string;
  aiExplanation?: string;
  createdAt: string;
}

export default function NotesPage() {
  const token = useAuthStore((s) => s.token);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiRequest<Note[]>('/notes', { token })
      .then(setNotes)
      .catch(() => setError('Failed to load notes'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <Link
            href="/notes/new"
            className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + New Note
          </Link>
        </div>

        {loading && <p className="text-muted-foreground">Loading...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && notes.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No notes yet.</p>
            <Link href="/notes/new" className="mt-2 block text-primary hover:underline">
              Create your first note
            </Link>
          </div>
        )}

        {/* Notes grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <div className="flex h-full flex-col justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold">{note.title}</h2>
                    {note.topic && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">{note.topic}</span>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    note.aiExplanation
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {note.aiExplanation ? 'AI' : 'Draft'}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}