import { Injectable } from "@nestjs/common";
import { Note, NoteGroupedByTopic } from "../../domain/entities/note.entity";
import { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";

@Injectable()
export class FindNotesUseCase {
  constructor(private readonly noteRepository: NoteRepositoryInterface) {}

  async execute(userId: string): Promise<Note[]> {
    return this.noteRepository.findAllByUser(userId);
  }

  async executeGrouped(userId: string): Promise<NoteGroupedByTopic[]> {
    return this.noteRepository.findAllGroupedByUser(userId);
  }
}
