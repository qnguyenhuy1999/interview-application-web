/**
 * MONOLITH (Before): PrismaService shared across all modules
 * MICROSERVICES (After): Service-specific PrismaService instance
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
