import { Controller, Get } from '@nestjs/common';
import { EmRealtimeApiService } from './em-realtime-api.service';

@Controller()
export class EmRealtimeApiController {
  constructor(private readonly emRealtimeApiService: EmRealtimeApiService) {}

  @Get()
  getHello(): string {
    return this.emRealtimeApiService.getHello();
  }
}
