import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL;
const prefix = 'em-realtime-api';

@Injectable()
export class RedisService implements OnModuleInit {
  private client = createClient({ url: REDIS_URL });

  async onModuleInit() {
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    await this.client.connect();
  }

  async set(key: string, value: string) {
    return this.client.set(`${prefix}-${key}`, value);
  }

  async get(key: string) {
    return this.client.get(`${prefix}-${key}`);
  }
}
