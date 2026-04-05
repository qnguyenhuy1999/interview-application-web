import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform<unknown> {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`,
        );
        throw new BadRequestException(issues.join("; "));
      }
      throw error;
    }
  }
}
