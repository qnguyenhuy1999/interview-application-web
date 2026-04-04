"use client";

import { useAuthStore } from "@features/auth";
import type { NoteGroup } from "@shared/types";
import { useEffect, useMemo, useState } from "react";
import { getNotesGrouped } from "../api";
import { NoteEmptyState } from "./note-empty-state";
import { NoteGrid } from "./note-grid";
import { NoteSearch } from "./note-search";
import { NoteSidebar } from "./note-sidebar";

interface NoteListContainerProps {
  onError?: (error: string) => void;
}

export function NoteListContainer({ onError }: NoteListContainerProps) {
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

  // Flatten and filter notes based on sidebar selection and search
  const displayNotes = useMemo(() => {
    let result = groups;

    if (selectedTopic !== "all") {
      result = result.filter((g) => g.topic === selectedTopic);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map((g) => ({
          ...g,
          notes: g.notes.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q) ||
              (n.topic?.toLowerCase().includes(q) ?? false),
          ),
        }))
        .filter((g) => g.notes.length > 0);
    }

    return result.flatMap((g) => g.notes);
  }, [groups, selectedTopic, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row animate-fade-in">
      {/* Left Sidebar */}
      <NoteSidebar
        groups={groups}
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
      />

      {/* Main Content Area */}
      <main className="flex-1 space-y-6 min-w-0">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {selectedTopic === "all" ? "All Mastery Concepts" : selectedTopic}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {displayNotes.length} concept
              {displayNotes.length !== 1 ? "s" : ""} available for review
            </p>
          </div>

          <NoteSearch onSearch={setSearchQuery} />
        </div>

        {/* Content States */}
        {groups.length === 0 && !loading ? (
          <NoteEmptyState />
        ) : (
          <NoteGrid
            notes={displayNotes}
            loading={loading}
            onClearFilters={
              displayNotes.length === 0 ? clearFilters : undefined
            }
          />
        )}
      </main>
    </div>
  );
}
