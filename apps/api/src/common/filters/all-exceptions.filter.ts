import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request as any).correlationId ??
      (request.headers["x-correlation-id"] as string) ??
      "unknown";

    let status: number;
    let message: string;
    let error: string;

    // Handle Prisma errors
    const prismaException = exception as { code?: string };
    if (prismaException.code === "P2025") {
      status = HttpStatus.NOT_FOUND;
      message = "Resource not found";
      error = "Not Found";
    } else if (prismaException.code === "P2002") {
      status = HttpStatus.CONFLICT;
      message = "Unique constraint violation";
      error = "Conflict";
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      if (typeof responseBody === "string") {
        message = responseBody;
        error = exception.name;
      } else if (typeof responseBody === "object") {
        const body = responseBody as Record<string, unknown>;
        message = Array.isArray(body.message)
          ? body.message.join("; ")
          : (body.message as string) || exception.message;
        error = (body.error as string) || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";
      error = exception.name;
      this.logger.error(
        `[${correlationId}] Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";
      error = "InternalServerError";
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId,
    });
  }
}
