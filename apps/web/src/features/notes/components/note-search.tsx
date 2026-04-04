"use client";

import { useDebounce } from "@shared/hooks";
import { useState } from "react";

interface NoteSearchProps {
  onSearch: (query: string) => void;
}

export function NoteSearch({ onSearch }: NoteSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Sync debounced value to parent
  useState(() => {
    onSearch(debouncedQuery);
  });

  return (
    <div className="relative w-full sm:w-72">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search concepts, topics..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full rounded-xl border border-input bg-card/60 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-sm"
      />
    </div>
  );
}
