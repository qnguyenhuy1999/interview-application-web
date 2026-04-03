'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@features/auth';
import { getNotes } from '../api';
import { NoteCard } from './note-card';
import { Spinner } from '@shared/components/atoms';
import type { Note } from '../types';

interface NoteListProps {
  onError?: (error: string) => void;
}

export function NoteList({ onError }: NoteListProps) {
  const token = useAuthStore((s) => s.token);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getNotes(token)
      .then(setNotes)
      .catch(() => onError?.('Failed to load notes'))
      .finally(() => setLoading(false));
  }, [token, onError]);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <Spinner />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No notes yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}