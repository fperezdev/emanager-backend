import { Module } from '@nestjs/common';
import { EmGmailReceiverController } from './em-gmail-receiver.controller';
import { EmGmailReceiverService } from './em-gmail-receiver.service';
import { GoogleService } from './google.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [EmGmailReceiverController],
  providers: [EmGmailReceiverService, GoogleService, PrismaService],
})
export class EmGmailReceiverModule {}
