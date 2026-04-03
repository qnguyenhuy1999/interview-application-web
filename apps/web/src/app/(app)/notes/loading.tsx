import { Spinner } from '@shared/components/atoms';

export default function NotesLoading() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex h-8 w-32 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
