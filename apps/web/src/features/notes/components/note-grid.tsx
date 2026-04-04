"use client";

import type { Note } from "@features/notes/types";
import { Spinner } from "@shared/components/atoms";
import { NoteCard } from "./note-card";

interface NoteGridProps {
  notes: Note[];
  loading?: boolean;
  onClearFilters?: () => void;
}

export function NoteGrid({ notes, loading, onClearFilters }: NoteGridProps) {
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (notes.length === 0 && onClearFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
        <p className="text-lg font-medium">No concepts found for this filter</p>
        <button
          onClick={onClearFilters}
          className="mt-4 text-sm font-bold text-primary hover:underline"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
