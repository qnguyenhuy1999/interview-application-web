import { apiClient } from '@shared/lib/api-client';
import type { Note, GenerateQuizResponse, PreviousQuizResponse } from '@shared/types';
import type { User } from '@shared/types';

export async function getNotes(token: string): Promise<Note[]> {
  return apiClient<Note[]>('/notes', { token });
}

export async function getNote(noteId: string, token: string): Promise<Note> {
  return apiClient<Note>(`/notes/${noteId}`, { token });
}

export interface CreateNoteInput {
  title: string;
  content: string;
  topic?: string;
}

export async function createNote(input: CreateNoteInput, token: string): Promise<Note> {
  return apiClient<Note>('/notes', {
    method: 'POST',
    body: input,
    token,
  });
}

export async function deepDiveNote(noteId: string, token: string): Promise<void> {
  await apiClient<void>(`/notes/${noteId}/deep-dive`, {
    method: 'POST',
    token,
  });
}

export async function generateQuiz(
  noteId: string,
  token: string,
): Promise<GenerateQuizResponse> {
  return apiClient<GenerateQuizResponse>(`/notes/${noteId}/generate-quiz`, {
    method: 'POST',
    token,
  });
}

export async function loadPreviousQuiz(
  noteId: string,
  token: string,
): Promise<PreviousQuizResponse> {
  return apiClient<PreviousQuizResponse>(`/notes/${noteId}/quiz/previous`, {
    token,
  });
}