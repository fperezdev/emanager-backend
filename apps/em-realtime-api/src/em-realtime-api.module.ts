import { Module } from '@nestjs/common';
import { EmRealtimeApiController } from './em-realtime-api.controller';
import { EmRealtimeApiService } from './em-realtime-api.service';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [EmRealtimeApiController],
  providers: [EmRealtimeApiService],
})
export class EmRealtimeApiModule {}
