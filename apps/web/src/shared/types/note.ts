export type { NoteGroup } from '../../../../../packages/shared/src/types/note';

export interface Note {
  id: string;
  title: string;
  topic?: string;
  content: string;
  aiExplanation?: string;
  hasQuiz?: boolean;
  createdAt: string;
}
