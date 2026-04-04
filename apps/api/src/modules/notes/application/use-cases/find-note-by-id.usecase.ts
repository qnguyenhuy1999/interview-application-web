import { ForbiddenException, Injectable } from "@nestjs/common";
import { NoteWithQuizFlag } from "../../domain/entities/note.entity";
import { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";

@Injectable()
export class FindNoteByIdUseCase {
  constructor(private readonly noteRepository: NoteRepositoryInterface) {}

  async execute(userId: string, noteId: string): Promise<NoteWithQuizFlag> {
    const note = await this.noteRepository.findByIdWithQuizFlag(userId, noteId);
    if (!note) {
      throw new ForbiddenException("Note not found or access denied");
    }
    return note;
  }
}
