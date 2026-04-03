import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';
import { AiService } from '../ai/ai.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(
    private notesService: NotesService,
    private aiService: AiService,
  ) {}

  @Post()
  create(@Request() req: { user: { id: string } }, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: { user: { id: string } }) {
    return this.notesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.notesService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.notesService.remove(req.user.id, id);
  }

  @Post(':id/deep-dive')
  async deepDive(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    const note = await this.notesService.findOne(req.user.id, id);
    const explanation = await this.aiService.generateDeepDive(note.content);
    return this.notesService.updateAiExplanation(req.user.id, id, explanation);
  }
}