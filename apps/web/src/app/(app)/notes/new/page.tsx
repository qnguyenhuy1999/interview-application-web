'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  topic?: string;
  content: string;
}

export default function NewNotePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const note = await apiRequest<Note>('/notes', {
        method: 'POST',
        body: { title, topic: topic || undefined, content },
        token,
      });
      router.push(`/notes/${note.id}`);
    } catch {
      setError('Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Create Note</h1>
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g., Database Indexing Strategies"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g., Databases, Performance"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none sm:rows-8"
              placeholder="Write your technical note here..."
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Note'}
          </Button>
        </form>
      </div>
    </div>
  );
}