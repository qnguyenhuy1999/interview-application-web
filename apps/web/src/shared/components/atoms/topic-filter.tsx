'use client';

import { useState, useMemo } from 'react';
import { Input } from './input';
import { Badge } from './badge';
import { cn } from '@shared/utils';

export interface TopicFilterProps {
  topics: string[];
  selectedTopic: string;
  searchQuery: string;
  onTopicChange: (topic: string) => void;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function TopicFilter({
  topics,
  selectedTopic,
  searchQuery,
  onTopicChange,
  onSearchChange,
  className,
}: TopicFilterProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayLabel = selectedTopic === 'all' ? 'All Topics' : selectedTopic;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:min-w-[200px] sm:max-w-xs">
        <Input
          type="search"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
        <svg
          className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Topic dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className={cn(
            'inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors',
            'bg-background hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            selectedTopic !== 'all'
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-input text-foreground',
          )}
          aria-expanded={dropdownOpen}
        >
          <span className="truncate max-w-[140px]">{displayLabel}</span>
          <svg
            className={cn('h-3.5 w-3.5 shrink-0 transition-transform', dropdownOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1.5 min-w-[180px] rounded-lg border bg-popover p-1 shadow-md">
              <button
                type="button"
                onClick={() => { onTopicChange('all'); setDropdownOpen(false); }}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                  selectedTopic === 'all' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent',
                )}
              >
                <span>All Topics</span>
                {selectedTopic === 'all' && (
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => { onTopicChange(topic); setDropdownOpen(false); }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                    selectedTopic === topic ? 'bg-accent text-accent-foreground' : 'hover:bg-accent',
                  )}
                >
                  <span className="truncate">{topic}</span>
                  {selectedTopic === topic && (
                    <svg className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Active filter indicator */}
      {selectedTopic !== 'all' && (
        <Badge variant="secondary" className="text-xs">
          {selectedTopic}
        </Badge>
      )}
    </div>
  );
}
