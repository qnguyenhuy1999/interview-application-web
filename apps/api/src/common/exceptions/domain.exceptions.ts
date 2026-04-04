import { ForbiddenException, NotFoundException } from "@nestjs/common";

export class NoteNotFoundException extends NotFoundException {
  constructor(noteId: string) {
    super(`Note with id "${noteId}" not found`);
  }
}

export class QuizNotFoundException extends NotFoundException {
  constructor(quizId: string) {
    super(`Quiz with id "${quizId}" not found`);
  }
}

export class KnowledgeGapNotFoundException extends NotFoundException {
  constructor(gapId: string) {
    super(`Knowledge gap with id "${gapId}" not found`);
  }
}

export class ResourceAccessDeniedException extends ForbiddenException {
  constructor(resource: string) {
    super(`You do not have permission to access this ${resource}`);
  }
}
