import { Controller, Get, Post, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('knowledge-gaps')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeGapsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Request() req: { user: { id: string } }) {
    const notes = await this.prisma.note.findMany({
      where: { userId: req.user.id },
      include: { knowledgeGaps: true },
    });
    return notes.flatMap((note) =>
      note.knowledgeGaps.map((gap) => ({ ...gap, noteTitle: note.title }))
    );
  }

  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() body: { noteId: string; topic: string; description: string },
  ) {
    const note = await this.prisma.note.findUnique({ where: { id: body.noteId } });
    if (!note || note.userId !== req.user.id) {
      throw new Error('Note not found');
    }
    return this.prisma.knowledgeGap.create({
      data: {
        noteId: body.noteId,
        topic: body.topic,
        description: body.description,
      },
    });
  }

  @Patch(':id/resolve')
  async resolve(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    const gap = await this.prisma.knowledgeGap.findUnique({ where: { id } });
    if (!gap) throw new Error('Knowledge gap not found');
    const note = await this.prisma.note.findUnique({ where: { id: gap.noteId } });
    if (!note || note.userId !== req.user.id) throw new Error('Not authorized');
    return this.prisma.knowledgeGap.update({
      where: { id },
      data: { resolved: true },
    });
  }
}
