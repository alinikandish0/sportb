import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export class UniqueConstraintViolationError extends Error {}

@Injectable()
export class IdempotencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(userId: string, key: string) {
    return this.prisma.idempotencyKey.findUnique({
      where: { userId_key: { userId, key } },
    });
  }

  async create(userId: string, key: string, response: unknown) {
    try {
      return await this.prisma.idempotencyKey.create({
        data: {
          userId,
          key,
          response: response as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // یه درخواست موازی همین الان همین (userId, key) رو ثبت کرد
        throw new UniqueConstraintViolationError();
      }
      throw error;
    }
  }
}
