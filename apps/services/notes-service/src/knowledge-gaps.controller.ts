/**
 * MONOLITH (Before): KnowledgeGapsController embedded in main app
 * MICROSERVICES (After): Knowledge gaps belong to notes service
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Controller, Get, Post, Body, Headers, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from './prisma.service';

@Controller('knowledge-gaps')
export class KnowledgeGapsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Headers('x-user-id') userId: string) {
    const notes = await this.prisma.note.findMany({
      where: { userId },
      include: { knowledgeGaps: true },
    });
    return notes.flatMap((note) =>
      note.knowledgeGaps.map((gap) => ({ ...gap, noteTitle: note.title })),
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Headers('x-user-id') userId: string,
    @Body() body: { noteId: string; topic: string; description: string },
  ) {
    const note = await this.prisma.note.findUnique({ where: { id: body.noteId } });
    if (!note || note.userId !== userId) throw new Error('Note not found');
    return this.prisma.knowledgeGap.create({ data: body });
  }

  @Patch(':id/resolve')
  @UseGuards(AuthGuard('jwt'))
  async resolve(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    const gap = await this.prisma.knowledgeGap.findUnique({ where: { id } });
    if (!gap) throw new Error('Knowledge gap not found');
    const note = await this.prisma.note.findUnique({ where: { id: gap.noteId } });
    if (!note || note.userId !== userId) throw new Error('Not authorized');
    return this.prisma.knowledgeGap.update({ where: { id }, data: { resolved: true } });
  }
}
