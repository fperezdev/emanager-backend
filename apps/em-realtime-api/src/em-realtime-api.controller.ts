import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Message, PushNotificationBody } from './lib/types';
import { EmRealtimeApiGateway } from './em-realtime-api.gateway';
import { EmRealtimeApiService } from './em-realtime-api.service';

@Controller('api/v1/em-realtime-api')
export class RealtimeApiController {
  constructor(
    private readonly realtimeGateway: EmRealtimeApiGateway,
    private readonly realtimeService: EmRealtimeApiService,
  ) {}

  @Get('status')
  status() {
    return 'EM Realtime API service is running';
  }

  // This endpoint is used by the GCP Pub/Sub to send notifications on received messages
  @Post('notification')
  async receiveNotification(@Body() body: PushNotificationBody) {
    console.log('Received notification');
    const { message: notificationMessage } = body;
    const { data: rawData } = notificationMessage;
    const message: Message = JSON.parse(
      Buffer.from(rawData, 'base64').toString('utf8'),
    );

    await this.realtimeGateway.sendNotification(message.to, message);
    // Default 201 for acknowdlegement
  }

  @Get('message/:email')
  async getMessages(@Param('email') email: string) {
    return await this.realtimeService.getMessages(email);
  }
}
