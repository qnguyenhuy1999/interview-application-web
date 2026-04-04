import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { CreateNoteUseCase } from "./application/use-cases/create-note.usecase";
import { DeepDiveNoteUseCase } from "./application/use-cases/deep-dive-note.usecase";
import { DeleteNoteUseCase } from "./application/use-cases/delete-note.usecase";
import { FindNoteByIdUseCase } from "./application/use-cases/find-note-by-id.usecase";
import { FindNotesUseCase } from "./application/use-cases/find-notes.usecase";
import { UpdateNoteUseCase } from "./application/use-cases/update-note.usecase";
import { PrismaNoteRepository } from "./infrastructure/persistence/prisma-note.repository";
import { NotesController } from "./presentation/controllers/notes.controller";

@Module({
  imports: [AiModule],
  controllers: [NotesController],
  providers: [
    PrismaNoteRepository,
    CreateNoteUseCase,
    FindNotesUseCase,
    FindNoteByIdUseCase,
    UpdateNoteUseCase,
    DeleteNoteUseCase,
    DeepDiveNoteUseCase,
  ],
  exports: [PrismaNoteRepository, FindNoteByIdUseCase],
})
export class NotesModule {}
