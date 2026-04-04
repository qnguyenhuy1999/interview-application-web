/**
 * MONOLITH (Before): No shared contracts between services
 * MICROSERVICES (After): Type-safe API contracts for notes service
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import type {
  CreateNoteRequest,
  UpdateNoteRequest,
  NoteResponse,
  GroupedNotesResponse,
} from './index';

export type { CreateNoteRequest, UpdateNoteRequest, NoteResponse, GroupedNotesResponse };

export const NotesRoutes = {
  LIST: '/notes',
  GROUPED: '/notes/grouped',
  CREATE: '/notes',
  GET: (id: string) => `/notes/${id}`,
  UPDATE: (id: string) => `/notes/${id}`,
  DELETE: (id: string) => `/notes/${id}`,
} as const;
