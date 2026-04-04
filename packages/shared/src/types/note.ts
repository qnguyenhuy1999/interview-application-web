export interface NoteGroup {
  topic: string;
  notes: Note[];
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  topic?: string;
  aiExplanation?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  topic?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  topic?: string;
}

export interface DeepDiveResponse {
  noteId: string;
  explanation: NoteExplanation;
}

export interface NoteExplanation {
  definition: string;
  whyItExists: string;
  coreConcepts: string[];
  internalMechanics: string;
  codeLevelExplanation: string;
  performanceConsiderations: string;
  tradeoffs: string[];
  commonInterviewQuestions: string[];
  realWorldProductionExample: string;
  commonMistakes: string[];
}
