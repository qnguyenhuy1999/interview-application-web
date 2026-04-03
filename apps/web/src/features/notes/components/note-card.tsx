import Link from 'next/link';
import { Badge } from '@shared/components/atoms';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`}>
      <div className="flex h-full flex-col justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-semibold">{note.title}</h2>
            {note.topic && (
              <span className="mt-0.5 block text-xs text-muted-foreground">{note.topic}</span>
            )}
          </div>
          <Badge variant={note.aiExplanation ? 'success' : 'warning'}>
            {note.aiExplanation ? 'AI' : 'Draft'}
          </Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{note.content}</p>
      </div>
    </Link>
  );
}