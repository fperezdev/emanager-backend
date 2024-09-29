import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmGmailReceiverService } from './em-gmail-receiver.service';
import { PushNotificationBody } from './lib/types';

@Controller('api/v1/em-receiver')
export class EmGmailReceiverController {
  constructor(
    private readonly emGmailReceiverService: EmGmailReceiverService,
  ) {}

  @Get('status')
  status() {
    return 'EM Receiver server is running';
  }

  @Post('notification')
  async receiveNotification(@Body() body: PushNotificationBody) {
    return await this.emGmailReceiverService.receiveNotification(body);
    // Default 201 for acknowdlegement
  }
}
