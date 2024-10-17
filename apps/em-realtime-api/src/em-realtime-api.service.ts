import { Injectable } from '@nestjs/common';

@Injectable()
export class EmRealtimeApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
