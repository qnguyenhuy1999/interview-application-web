'use client';

import { useEffect } from 'react';

export default function NoteDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Note detail error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="text-2xl font-bold">Failed to load note</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
