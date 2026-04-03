'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@features/auth';
import { createNote } from '../api';
import { Button } from '@shared/components/atoms';
import { Input, Textarea } from '@shared/components/atoms';

interface NoteFormProps {
  onSuccess?: (noteId: string) => void;
}

export function NoteForm({ onSuccess }: NoteFormProps) {
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
      const note = await createNote(
        { title, content, topic: topic || undefined },
        token,
      );
      onSuccess?.(note.id);
      router.push(`/notes/${note.id}`);
    } catch {
      setError('Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">Title *</label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g., Database Indexing Strategies"
        />
      </div>

      <div>
        <label htmlFor="topic" className="mb-1 block text-sm font-medium">Topic</label>
        <Input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Databases, Performance"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">Content *</label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          placeholder="Write your technical note here..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Note'}
      </Button>
    </form>
  );
}