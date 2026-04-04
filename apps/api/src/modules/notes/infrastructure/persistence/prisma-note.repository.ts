/**
 * BEFORE: NotesService had all Prisma calls inline, including $queryRaw for findAllGrouped
 * AFTER: PrismaNoteRepository implements NoteRepositoryInterface with type-safe Prisma queries
 *        Note: findAllGroupedByUser replaces raw $queryRaw with Prisma groupBy + aggregation
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import {
  NoteRepositoryInterface,
  CreateNoteData,
  UpdateNoteData,
} from '../../domain/repositories/note-repository.interface';
import { Note, NoteWithQuizFlag, NoteGroupedByTopic } from '../../domain/entities/note.entity';

@Injectable()
export class PrismaNoteRepository implements NoteRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNoteData): Promise<Note> {
    return this.prisma.note.create({ data });
  }

  async findAllByUser(userId: string): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllGroupedByUser(userId: string): Promise<NoteGroupedByTopic[]> {
    // Get all notes for user with topic info
    const notes = await this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, userId: true, title: true, content: true, topic: true, aiExplanation: true, createdAt: true, updatedAt: true },
    });

    // Group by topic using a Map (replaces raw SQL GROUP BY + JSON_AGG)
    const groupedMap = new Map<string | null, Note[]>();
    for (const note of notes) {
      const key = note.topic ?? null;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, []);
      }
      groupedMap.get(key)!.push(note);
    }

    // Sort: null topic ('__no_topic__') last, then alphabetically
    const sortedKeys = Array.from(groupedMap.keys()).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((topic) => ({
      topic: topic ?? '__no_topic__',
      notes: groupedMap.get(topic)!,
    }));
  }

  async findById(id: string): Promise<Note | null> {
    return this.prisma.note.findUnique({ where: { id } });
  }

  async findByIdWithQuizFlag(userId: string, id: string): Promise<NoteWithQuizFlag | null> {
    const [note, quizCount] = await Promise.all([
      this.prisma.note.findUnique({ where: { id } }),
      this.prisma.quiz.count({ where: { noteId: id } }),
    ]);
    if (!note) return null;
    return { ...note, hasQuiz: quizCount > 0 };
  }

  async update(id: string, data: UpdateNoteData): Promise<Note> {
    return this.prisma.note.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Note> {
    return this.prisma.note.delete({ where: { id } });
  }

  async updateAiExplanation(id: string, explanation: string): Promise<Note> {
    return this.prisma.note.update({
      where: { id },
      data: { aiExplanation: explanation },
    });
  }
}
