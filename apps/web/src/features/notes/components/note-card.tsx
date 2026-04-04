import Link from 'next/link';
import type { Note } from '../types';
import { cn } from '@shared/utils';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  // Derive a conceptual "status" based on the data we have.
  // In a real app with spaced repetition, this would use confidence scores.
  const isMastered = note.hasQuiz && note.aiExplanation;
  const isReviewed = note.aiExplanation && !note.hasQuiz;
  
  const statusColor = isMastered 
    ? "bg-emerald-500 shadow-emerald-500/20" 
    : isReviewed 
      ? "bg-amber-400 shadow-amber-400/20" 
      : "bg-slate-300 shadow-slate-300/20";
      
  const statusGlow = isMastered 
    ? "group-hover:shadow-emerald-500/10" 
    : isReviewed 
      ? "group-hover:shadow-amber-400/10" 
      : "group-hover:shadow-primary/5";

  // Format date if available
  const dateStr = note.createdAt ? new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

  return (
    <Link href={`/notes/${note.id}`} className={cn("group block h-full animate-fade-in-up")}>
      <div className={cn("relative flex h-full flex-col justify-between rounded-xl border border-border/40 bg-card/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-xl overflow-hidden", statusGlow)}>
        
        {/* Subtle decorative top border representing status */}
        <div className={cn("absolute top-0 left-0 h-1 w-full opacity-50 transition-opacity group-hover:opacity-100", isMastered ? "bg-emerald-500" : isReviewed ? "bg-amber-400" : "bg-primary")} />

        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("h-2.5 w-2.5 rounded-full shadow-sm", statusColor)} />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isMastered ? "Mastery Achieved" : isReviewed ? "Needs Practice" : "Draft Concept"}
                </span>
              </div>
              <h2 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {note.title}
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <p className="line-clamp-3 text-sm font-light leading-relaxed text-muted-foreground">
              {note.content}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
          <div className="flex items-center text-xs font-medium text-muted-foreground">
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Added {dateStr}
          </div>
          <div className="flex items-center text-xs font-bold text-primary opacity-0 transition-all duration-300 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
            {note.hasQuiz ? 'Resume Practice' : 'Start Review'}
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}