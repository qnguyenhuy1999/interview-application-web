import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { User } from "../../domain/entities/user.entity";
import { UserRepositoryInterface } from "../../domain/repositories/user-repository.interface";

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
