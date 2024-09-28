import { Injectable } from '@nestjs/common';

@Injectable()
export class EmAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
