export class DomainException extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "DomainException";
  }
}

export class NotFoundException extends DomainException {
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(404, message, code);
    this.name = "NotFoundException";
  }
}

export class ForbiddenException extends DomainException {
  constructor(
    message = "You do not have permission to perform this action",
    code = "FORBIDDEN",
  ) {
    super(403, message, code);
    this.name = "ForbiddenException";
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message = "Authentication required", code = "UNAUTHORIZED") {
    super(401, message, code);
    this.name = "UnauthorizedException";
  }
}

export class BadRequestException extends DomainException {
  constructor(message = "Invalid request", code = "BAD_REQUEST") {
    super(400, message, code);
    this.name = "BadRequestException";
  }
}

export class ConflictException extends DomainException {
  constructor(message = "Resource conflict", code = "CONFLICT") {
    super(409, message, code);
    this.name = "ConflictException";
  }
}
