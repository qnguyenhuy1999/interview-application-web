import { Module } from "@nestjs/common";
import { AiService } from "./application/use-cases/ai.service";

@Module({
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
