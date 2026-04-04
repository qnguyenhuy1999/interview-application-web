import { ForbiddenException, Injectable } from "@nestjs/common";
import { AiService } from "../../../ai/application/use-cases/ai.service";
import { Note } from "../../domain/entities/note.entity";
import { NoteRepositoryInterface } from "../../domain/repositories/note-repository.interface";

@Injectable()
export class DeepDiveNoteUseCase {
  constructor(
    private readonly noteRepository: NoteRepositoryInterface,
    private readonly aiService: AiService,
  ) {}

  async execute(userId: string, noteId: string): Promise<Note> {
    const note = await this.noteRepository.findById(noteId);
    if (!note || note.userId !== userId) {
      throw new ForbiddenException("Note not found or access denied");
    }
    const explanation = await this.aiService.generateDeepDive(note.content);
    return this.noteRepository.updateAiExplanation(noteId, explanation);
  }
}
