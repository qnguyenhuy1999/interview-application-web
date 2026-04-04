import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LoginUseCase } from "./application/use-cases/login.usecase";
import { RegisterUseCase } from "./application/use-cases/register.usecase";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma-user.repository";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./presentation/controllers/auth.controller";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, RegisterUseCase, LoginUseCase, PrismaUserRepository],
  exports: [RegisterUseCase, LoginUseCase],
})
export class AuthModule {}
