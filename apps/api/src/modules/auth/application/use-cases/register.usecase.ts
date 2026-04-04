import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { AuthResult, UserPublic } from "../../domain/entities/user.entity";
import { UserRepositoryInterface } from "../../domain/repositories/user-repository.interface";
import { RegisterDto } from "../../dto";

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    const publicUser: UserPublic = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };

    return {
      user: publicUser,
      accessToken: token,
      expiresIn: 604800,
    };
  }
}
