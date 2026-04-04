import {
    Note,
    NoteGroupedByTopic,
    NoteWithQuizFlag,
} from "../entities/note.entity";

export interface CreateNoteData {
  userId: string;
  title: string;
  content: string;
  topic?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  topic?: string;
}

export interface NoteRepositoryInterface {
  create(data: CreateNoteData): Promise<Note>;
  findAllByUser(userId: string): Promise<Note[]>;
  findAllGroupedByUser(userId: string): Promise<NoteGroupedByTopic[]>;
  findById(id: string): Promise<Note | null>;
  findByIdWithQuizFlag(
    userId: string,
    id: string,
  ): Promise<NoteWithQuizFlag | null>;
  update(id: string, data: UpdateNoteData): Promise<Note>;
  delete(id: string): Promise<Note>;
  updateAiExplanation(id: string, explanation: string): Promise<Note>;
}
