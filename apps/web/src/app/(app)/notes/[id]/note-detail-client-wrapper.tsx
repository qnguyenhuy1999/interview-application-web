"use client";

import { useAuthStore } from "@features/auth";
import { getNote } from "@features/notes/api";
import { NoteDetailClient } from "@features/notes/components";
import type { Note } from "@features/notes/types";
import { Button } from "@shared/components/atoms";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface NoteDetailClientWrapperProps {
  noteId: string;
}

export function NoteDetailClientWrapper({
  noteId,
}: NoteDetailClientWrapperProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNote = useCallback(() => {
    if (!token) return;
    getNote(noteId, token)
      .then(setNote)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, noteId]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
        <p className="text-xl font-medium text-foreground">Note not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/notes")}
        >
          Return to Syllabus
        </Button>
      </div>
    );
  }

  return <NoteDetailClient note={note} onDeepDiveComplete={fetchNote} />;
}
