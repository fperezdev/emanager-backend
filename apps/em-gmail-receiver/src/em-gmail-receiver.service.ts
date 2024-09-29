import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GoogleService } from './google.service';
import { PushNotificationBody, PushNotificationData } from './lib/types';

@Injectable()
export class EmGmailReceiverService {
  constructor(
    private googleService: GoogleService,
    private prismaService: PrismaService,
  ) {}

  receiveNotification = async ({ message }: PushNotificationBody) => {
    const { data: dataBase64 } = message;
    const data: PushNotificationData = JSON.parse(
      Buffer.from(dataBase64, 'base64').toString('utf8'),
    );

    const { emailAddress, historyId: newHistoryId } = data;

    const user = await this.prismaService.user.findFirst({
      where: { email: emailAddress },
    });

    const { lastHistoryId, accessToken, refreshToken } = user;

    if (!lastHistoryId || !accessToken || !refreshToken) {
      console.log(new Date(), 'User parameters missing', data, user);
      throw new NotFoundException('User parameters missing');
    }

    if (lastHistoryId >= newHistoryId) {
      console.log(new Date(), 'Received old history id', data);
      return;
    }

    const newMessages = await this.googleService.getMessages(
      emailAddress,
      accessToken,
      lastHistoryId,
    );

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastHistoryId: newHistoryId },
    });

    console.log(new Date(), 'User updated', updatedUser);
    console.log(new Date(), 'New messages', newMessages);
  };
}
