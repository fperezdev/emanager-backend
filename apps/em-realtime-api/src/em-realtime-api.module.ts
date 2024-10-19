import { Module } from '@nestjs/common';
import { EmRealtimeApiService } from './em-realtime-api.service';
import { EmRealtimeApiGateway } from './em-realtime-api.gateway';
import { RealtimeApiController } from './em-realtime-api.controller';
import { RedisService } from './redis.service';

@Module({
  providers: [
    EmRealtimeApiModule,
    EmRealtimeApiService,
    EmRealtimeApiGateway,
    RedisService,
  ],
  controllers: [RealtimeApiController],
})
export class EmRealtimeApiModule {}
