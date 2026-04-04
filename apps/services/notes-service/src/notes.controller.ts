/**
 * MONOLITH (Before): NotesController embedded in main app
 * MICROSERVICES (After): Standalone Notes Service controller
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Headers('x-user-id') userId: string,
    @Body() body: { title: string; content: string; topic?: string },
  ) {
    return this.notesService.create(userId, body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Headers('x-user-id') userId: string) {
    return this.notesService.findAll(userId);
  }

  @Get('grouped')
  @UseGuards(AuthGuard('jwt'))
  findAllGrouped(@Headers('x-user-id') userId: string) {
    return this.notesService.findAllGrouped(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.notesService.findOne(userId, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string; topic?: string },
  ) {
    return this.notesService.update(userId, id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.notesService.remove(userId, id);
  }
}
