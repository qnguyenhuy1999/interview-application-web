import { ForbiddenException, Injectable } from "@nestjs/common";
import { Note } from "../../domain/entities/note.entity";
import { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";
import { UpdateNoteDto } from "../../dto";

@Injectable()
export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepositoryInterface) {}

  async execute(
    userId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ): Promise<Note> {
    const existing = await this.noteRepository.findById(noteId);
    if (!existing) {
      throw new ForbiddenException("Note not found or access denied");
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException("Note not found or access denied");
    }
    return this.noteRepository.update(noteId, dto);
  }
}
