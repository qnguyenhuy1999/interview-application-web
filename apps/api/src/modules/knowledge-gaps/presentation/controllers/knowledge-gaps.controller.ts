import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../../../common/guards/jwt-auth.guard";
import { ZodValidationPipe } from "../../../../common/pipes/zod-validation.pipe";
import { CreateKnowledgeGapUseCase } from "../../application/use-cases/create-knowledge-gap.usecase";
import { FindKnowledgeGapsUseCase } from "../../application/use-cases/find-knowledge-gaps.usecase";
import { ResolveKnowledgeGapUseCase } from "../../application/use-cases/resolve-knowledge-gap.usecase";
import {
    CreateKnowledgeGapDto,
    createKnowledgeGapSchema,
    KnowledgeGapIdParam,
    knowledgeGapIdParamSchema,
} from "../../dto";

@Controller("knowledge-gaps")
@UseGuards(JwtAuthGuard)
export class KnowledgeGapsController {
  constructor(
    private readonly findKnowledgeGapsUseCase: FindKnowledgeGapsUseCase,
    private readonly createKnowledgeGapUseCase: CreateKnowledgeGapUseCase,
    private readonly resolveKnowledgeGapUseCase: ResolveKnowledgeGapUseCase,
  ) {}

  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.findKnowledgeGapsUseCase.execute(userId);
  }

  @Post()
  create(
    @CurrentUser("id") userId: string,
    @Body(new ZodValidationPipe(createKnowledgeGapSchema))
    dto: CreateKnowledgeGapDto,
  ) {
    return this.createKnowledgeGapUseCase.execute(userId, dto);
  }

  @Patch(":id/resolve")
  resolve(
    @CurrentUser("id") userId: string,
    @Param(new ZodValidationPipe(knowledgeGapIdParamSchema))
    { id }: KnowledgeGapIdParam,
  ) {
    return this.resolveKnowledgeGapUseCase.execute(userId, id);
  }
}
