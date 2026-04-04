export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  topic: string | null;
  aiExplanation: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteWithQuizFlag extends Note {
  hasQuiz: boolean;
}

export interface NoteGroupedByTopic {
  topic: string;
  notes: Note[];
}
