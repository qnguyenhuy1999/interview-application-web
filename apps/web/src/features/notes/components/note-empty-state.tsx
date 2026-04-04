"use client";

import Link from "next/link";

export function NoteEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center bg-card/30 backdrop-blur-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold">Your Syllabus is Empty</h2>
      <p className="mt-2 max-w-md text-base text-muted-foreground">
        You haven't added any study topics yet. Start populating your mastery
        dashboard to begin interview training.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left flex items-center gap-2">
          <span className="text-emerald-500">✨</span> System Design Basics
        </button>
        <button className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left flex items-center gap-2">
          <span className="text-blue-500">✨</span> React Core Hooks
        </button>
        <Link
          href="/notes/new"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5"
        >
          + Create Custom Note
        </Link>
      </div>
    </div>
  );
}
