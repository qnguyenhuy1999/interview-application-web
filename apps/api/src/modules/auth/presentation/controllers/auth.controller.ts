import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../../../../common/pipes/zod-validation.pipe";
import { LoginUseCase } from "../../application/use-cases/login.usecase";
import { RegisterUseCase } from "../../application/use-cases/register.usecase";
import { LoginDto, loginSchema, RegisterDto, registerSchema } from "../../dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post("register")
  async register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterDto,
  ) {
    return this.registerUseCase.execute(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ZodValidationPipe(loginSchema)) dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
