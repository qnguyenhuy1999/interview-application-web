import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const CORRELATION_ID_HEADER = "x-correlation-id";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const existing = req.headers[CORRELATION_ID_HEADER];
    const correlationId =
      typeof existing === "string" && existing.length > 0 ? existing : uuidv4();

    (req as unknown as Record<string, unknown>).correlationId = correlationId;

    // Attach to response headers so the client can see it
    _res.setHeader(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
