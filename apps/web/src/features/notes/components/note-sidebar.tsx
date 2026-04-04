"use client";

import type { NoteGroup } from "@shared/types";
import { cn } from "@shared/utils";
import Link from "next/link";

interface NoteSidebarProps {
  groups: NoteGroup[];
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

export function NoteSidebar({
  groups,
  selectedTopic,
  onSelectTopic,
}: NoteSidebarProps) {
  const allTopics = groups
    .map((g) => g.topic)
    .filter((t) => t !== "__no_topic__")
    .sort();

  const totalNotes = groups.reduce((sum, g) => sum + g.notes.length, 0);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-28 rounded-2xl border border-border/50 bg-card/40 p-5 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Your Syllabus
        </h2>
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => onSelectTopic("all")}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              selectedTopic === "all"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-muted/80",
            )}
          >
            <span>All Topics</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                selectedTopic === "all"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {totalNotes}
            </span>
          </button>

          {allTopics.map((topic) => {
            const count =
              groups.find((g) => g.topic === topic)?.notes.length || 0;
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => onSelectTopic(topic)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                <span className="truncate pr-2">{topic}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background text-muted-foreground border border-border/50",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-border/50">
          <Link
            href="/notes/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/20 cursor-pointer"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Note
          </Link>
        </div>
      </div>
    </aside>
  );
}
