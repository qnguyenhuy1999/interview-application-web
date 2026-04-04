import { useCallback, useEffect, useState } from "react";
import { apiClient, cacheUtils } from "../lib/api-client";
import type { Note, NoteGroup } from "../types";

interface UseNotesResult {
  data: Note[];
  groupedData: NoteGroup[];
  error: string | null;
  isLoading: boolean;
  mutate: () => void;
  refetch: () => Promise<void>;
}

export function useNotes(token: string | null): UseNotesResult {
  const [data, setData] = useState<Note[]>([]);
  const [groupedData, setGroupedData] = useState<NoteGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!token) {
      setData([]);
      setGroupedData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [notes, grouped] = await Promise.all([
        apiClient<Note[]>("/notes", { token, skipCache: true }),
        apiClient<NoteGroup[]>("/notes/grouped", { token, skipCache: true }),
      ]);
      setData(notes);
      setGroupedData(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const mutate = useCallback(() => {
    // Invalidate cache and refetch
    cacheUtils.invalidate("/notes");
    cacheUtils.invalidate("/notes/grouped");
    fetchNotes();
  }, [fetchNotes]);

  return { data, groupedData, error, isLoading, mutate, refetch: fetchNotes };
}

interface UseNoteResult {
  data: Note | null;
  error: string | null;
  isLoading: boolean;
  mutate: () => void;
}

export function useNote(
  noteId: string | null,
  token: string | null,
): UseNoteResult {
  const [data, setData] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNote = useCallback(async () => {
    if (!noteId || !token) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const note = await apiClient<Note>(`/notes/${noteId}`, {
        token,
        skipCache: true,
      });
      setData(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load note");
    } finally {
      setIsLoading(false);
    }
  }, [noteId, token]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const mutate = useCallback(() => {
    if (noteId) {
      cacheUtils.invalidate(`/notes/${noteId}`);
    }
    fetchNote();
  }, [noteId, fetchNote]);

  return { data, error, isLoading, mutate };
}
