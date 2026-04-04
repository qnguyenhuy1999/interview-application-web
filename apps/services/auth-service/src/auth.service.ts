/**
 * MONOLITH (Before): AuthService embedded in main app
 * MICROSERVICES (After): Standalone Auth Service with bcrypt + JWT
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, accessToken: token, expiresIn: 604800 };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
      accessToken: token,
      expiresIn: 604800,
    };
  }
}
