import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { generateDocNumber } from '../utils/document-number.util';

/**
 * Shared, atomic document-number generator.
 * Increments the per-prefix counter and returns a formatted number.
 */
@Injectable()
export class CounterService {
  constructor(private readonly prisma: PrismaService) {}

  async next(prefix: string, date: Date = new Date()): Promise<string> {
    const upper = prefix.toUpperCase();
    // Atomic upsert + increment inside a transaction to avoid duplicate numbers.
    const counter = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.documentCounter.findUnique({
        where: { prefix: upper },
      });
      if (!existing) {
        return tx.documentCounter.create({
          data: { prefix: upper, currentNumber: 1 },
        });
      }
      return tx.documentCounter.update({
        where: { prefix: upper },
        data: { currentNumber: { increment: 1 } },
      });
    });
    return generateDocNumber(upper, counter.currentNumber, date);
  }
}
