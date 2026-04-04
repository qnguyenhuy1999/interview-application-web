/**
 * MONOLITH (Before): PrismaModule shared across all modules
 * MICROSERVICES (After): Service-specific PrismaModule
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
