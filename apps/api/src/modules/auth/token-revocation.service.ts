import { Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../../infrastructure/redis/redis.provider';

@Injectable()
export class TokenRevocationService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private key(tokenHash: string): string {
    return `revoked:${tokenHash}`;
  }

  async revoke(tokenHash: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.key(tokenHash), '1', 'EX', Math.max(ttlSeconds, 1));
  }

  async isRevoked(tokenHash: string): Promise<boolean> {
    const result = await this.redis.get(this.key(tokenHash));
    return result !== null;
  }
}
