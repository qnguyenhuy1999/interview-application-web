import { Injectable } from "@nestjs/common";
import { Note } from "../../domain/entities/note.entity";
import { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";
import { CreateNoteDto } from "../../dto";

@Injectable()
export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepositoryInterface) {}

  async execute(userId: string, dto: CreateNoteDto): Promise<Note> {
    return this.noteRepository.create({ userId, ...dto });
  }
}
