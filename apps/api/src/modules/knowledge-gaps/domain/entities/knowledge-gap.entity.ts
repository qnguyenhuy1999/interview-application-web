export interface KnowledgeGap {
  id: string;
  noteId: string;
  topic: string;
  description: string;
  resolved: boolean;
  weaknessLevel: number;
  createdAt: Date;
}

export interface KnowledgeGapWithNoteTitle extends KnowledgeGap {
  noteTitle: string;
}
