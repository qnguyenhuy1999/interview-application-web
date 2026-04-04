import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { AuthResult } from "../../domain/entities/user.entity";
import { UserRepositoryInterface } from "../../domain/repositories/user-repository.interface";
import { LoginDto } from "../../dto";

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
      accessToken: token,
      expiresIn: 604800,
    };
  }
}
