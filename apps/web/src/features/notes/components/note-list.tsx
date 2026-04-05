"use client";

import { useAuthStore } from "@features/auth";
import { Badge, Spinner } from "@shared/components/atoms";
import type { NoteGroup } from "@shared/types";
import { cn } from "@shared/utils";
import { useEffect, useMemo, useState } from "react";
import { getNotesGrouped } from "../api";
import { NoteCard } from "./note-card";
import Link from "next/link";

interface NoteListProps {
  onError?: (error: string) => void;
}

export function NoteList({ onError }: NoteListProps) {
  const token = useAuthStore((s) => s.token);
  const [groups, setGroups] = useState<NoteGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");

  useEffect(() => {
    if (!token) return;
    getNotesGrouped(token)
      .then(setGroups)
      .catch(() => onError?.("Failed to load notes"))
      .finally(() => setLoading(false));
  }, [token, onError]);

  // Unique topics from API
  const allTopics = useMemo(
    () =>
      groups
        .map((g) => g.topic)
        .filter((t) => t !== "__no_topic__")
        .sort(),
    [groups],
  );

  // Flatten and filter notes based on sidebar selection and search
  const displayNotes = useMemo(() => {
    let result = groups;

    if (selectedTopic !== "all") {
      result = result.filter((g) => g.topic === selectedTopic);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.map((g) => ({
        ...g,
        notes: g.notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            (n.topic?.toLowerCase().includes(q) ?? false),
        ),
      })).filter((g) => g.notes.length > 0);
    }

    // Return flat list of sorted notes corresponding to selected topic
    return result.flatMap((g) => g.notes);
  }, [groups, selectedTopic, searchQuery]);

  const totalNotes = groups.reduce((sum, g) => sum + g.notes.length, 0);

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row animate-fade-in">
      
      {/* 1. Left Sidebar (Syllabus Mode) */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-28 rounded-2xl border border-border/50 bg-card/40 p-5 shadow-sm backdrop-blur-xl">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Syllabus</h2>
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setSelectedTopic("all")}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                selectedTopic === "all" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-foreground hover:bg-muted/80"
              )}
            >
              <span>All Topics</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", selectedTopic === "all" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {totalNotes}
              </span>
            </button>
            
            {allTopics.map((topic) => {
              const count = groups.find(g => g.topic === topic)?.notes.length || 0;
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isSelected 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <span className="truncate pr-2">{topic}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground border border-border/50")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-border/50">
             <Link href="/notes/new" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/20 cursor-pointer">
               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
               </svg>
               Create New Note
             </Link>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 space-y-6 min-w-0">
        
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {selectedTopic === 'all' ? 'All Mastery Concepts' : selectedTopic}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {displayNotes.length} concept{displayNotes.length !== 1 ? 's' : ''} available for review
            </p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search concepts, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-card/60 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Global Empty State (No notes entirely) */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center bg-card/30 backdrop-blur-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Your Syllabus is Empty</h2>
            <p className="mt-2 max-w-md text-base text-muted-foreground">
              You haven&apos;t added any study topics yet. Start populating your mastery dashboard to begin interview training.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left flex items-center gap-2">
                <span className="text-emerald-500">✨</span> System Design Basics
              </button>
              <button className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left flex items-center gap-2">
                <span className="text-blue-500">✨</span> React Core Hooks
              </button>
              <Link href="/notes/new" className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5">
                + Create Custom Note
              </Link>
            </div>
          </div>
        ) : displayNotes.length === 0 ? (
          /* Filtered Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
            <p className="text-lg font-medium">No concepts found for this filter</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedTopic("all"); }}
              className="mt-4 text-sm font-bold text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Grid View */
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
            {displayNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
