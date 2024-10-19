import { Body, Controller, Get, Post } from '@nestjs/common';
import { Message, PushNotificationBody } from './lib/types';
import { EmRealtimeApiGateway } from './em-realtime-api.gateway';

@Controller('api/v1/em-realtime-api')
export class RealtimeApiController {
  constructor(private readonly realtimeGateway: EmRealtimeApiGateway) {}

  @Get('status')
  status() {
    return 'EM Realtime API service is running';
  }

  @Get('status-v2')
  statusV2() {
    return 'EM Realtime API service is running v2';
  }

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
}
