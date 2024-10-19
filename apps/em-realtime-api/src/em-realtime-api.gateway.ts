import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from './redis.service';
import { Message } from './lib/types';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway()
export class EmRealtimeApiGateway {
  constructor(private readonly redisService: RedisService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connection')
  handleMessage(client: Socket, payload: string) {
    const email = payload;
    this.redisService.set(`${email}-client-id`, client.id);
    console.log('Client saved to cache', email);
  }

  async sendNotification(email: string, message: Message) {
    const clientId = await this.redisService.get(`${email}-client-id`);
    console.log('Sending notification to', email, clientId);
    if (!clientId)
      throw new InternalServerErrorException('Client not found in cache');
    this.server.to(clientId).emit('notification', message);
  }
}
