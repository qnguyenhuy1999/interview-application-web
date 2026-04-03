import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: { ...dto, userId },
    });
  }

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, noteId: string) {
    const [note, quizCount] = await Promise.all([
      this.prisma.note.findUnique({ where: { id: noteId } }),
      this.prisma.quiz.count({ where: { noteId } }),
    ]);
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException();
    return { ...note, hasQuiz: quizCount > 0 };
  }

  async update(userId: string, noteId: string, dto: UpdateNoteDto) {
    await this.findOne(userId, noteId);
    return this.prisma.note.update({
      where: { id: noteId },
      data: dto,
    });
  }

  async remove(userId: string, noteId: string) {
    await this.findOne(userId, noteId);
    return this.prisma.note.delete({ where: { id: noteId } });
  }

  async updateAiExplanation(userId: string, noteId: string, explanation: string) {
    await this.findOne(userId, noteId);
    return this.prisma.note.update({
      where: { id: noteId },
      data: { aiExplanation: explanation },
    });
  }
}