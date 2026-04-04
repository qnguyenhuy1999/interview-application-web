/**
 * MONOLITH (Before): NotesService embedded in main app
 * MICROSERVICES (After): Standalone Notes Service with Redis caching
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { title: string; content: string; topic?: string }) {
    const note = await this.prisma.note.create({
      data: { ...dto, userId },
    });
    // TODO: Publish note.created event for async workflows (quiz generation)
    return note;
  }

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllGrouped(userId: string) {
    const result = await this.prisma.$queryRaw<
      { topic: string; notes: object }[]
    >`
      SELECT
        COALESCE(topic, '__no_topic__') AS topic,
        JSON_AGG(
          json_build_object(
            'id', id, 'title', title, 'content', content,
            'topic', topic, 'createdAt', "created_at", 'updatedAt', "updated_at"
          ) ORDER BY "created_at" DESC
        ) AS notes
      FROM notes
      WHERE "user_id" = ${userId}
      GROUP BY COALESCE(topic, '__no_topic__')
    `;
    return result.map((row) => ({ topic: row.topic, notes: row.notes as object[] }));
  }

  async findOne(userId: string, noteId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException();
    return note;
  }

  async update(userId: string, noteId: string, dto: { title?: string; content?: string; topic?: string }) {
    await this.findOne(userId, noteId);
    return this.prisma.note.update({ where: { id: noteId }, data: dto });
  }

  async remove(userId: string, noteId: string) {
    await this.findOne(userId, noteId);
    return this.prisma.note.delete({ where: { id: noteId } });
  }
}
