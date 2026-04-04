import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../../../common/pipes/zod-validation.pipe";
import { CreateNoteUseCase } from "../../application/use-cases/create-note.usecase";
import { DeepDiveNoteUseCase } from "../../application/use-cases/deep-dive-note.usecase";
import { DeleteNoteUseCase } from "../../application/use-cases/delete-note.usecase";
import { FindNoteByIdUseCase } from "../../application/use-cases/find-note-by-id.usecase";
import { FindNotesUseCase } from "../../application/use-cases/find-notes.usecase";
import { UpdateNoteUseCase } from "../../application/use-cases/update-note.usecase";
import {
    CreateNoteDto,
    createNoteSchema,
    noteIdParamSchema,
    UpdateNoteDto,
    updateNoteSchema,
} from "../../dto";

@Controller("notes")
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly findNotesUseCase: FindNotesUseCase,
    private readonly findNoteByIdUseCase: FindNoteByIdUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
    private readonly deepDiveNoteUseCase: DeepDiveNoteUseCase,
  ) {}

  @Post()
  create(
    @CurrentUser("id") userId: string,
    @Body(new ZodValidationPipe(createNoteSchema)) dto: CreateNoteDto,
  ) {
    return this.createNoteUseCase.execute(userId, dto);
  }

  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.findNotesUseCase.execute(userId);
  }

  @Get("grouped")
  findAllGrouped(@CurrentUser("id") userId: string) {
    return this.findNotesUseCase.executeGrouped(userId);
  }

  @Get(":id")
  findOne(
    @CurrentUser("id") userId: string,
    @Param(new ZodValidationPipe(noteIdParamSchema)) { id }: { id: string },
  ) {
    return this.findNoteByIdUseCase.execute(userId, id);
  }

  @Put(":id")
  update(
    @CurrentUser("id") userId: string,
    @Param(new ZodValidationPipe(noteIdParamSchema)) { id }: { id: string },
    @Body(new ZodValidationPipe(updateNoteSchema)) dto: UpdateNoteDto,
  ) {
    return this.updateNoteUseCase.execute(userId, id, dto);
  }

  @Delete(":id")
  remove(
    @CurrentUser("id") userId: string,
    @Param(new ZodValidationPipe(noteIdParamSchema)) { id }: { id: string },
  ) {
    return this.deleteNoteUseCase.execute(userId, id);
  }

  @Post(":id/deep-dive")
  async deepDive(
    @CurrentUser("id") userId: string,
    @Param(new ZodValidationPipe(noteIdParamSchema)) { id }: { id: string },
  ) {
    return this.deepDiveNoteUseCase.execute(userId, id);
  }
}
