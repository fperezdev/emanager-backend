import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from './redis.service';
import { Message } from './lib/types';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway({ namespace: 'api/v1/em-realtime-api/ws' })
export class EmRealtimeApiGateway implements OnGatewayDisconnect {
  constructor(private readonly redisService: RedisService) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('hi')
  handleHi(client: Socket) {
    const ack = client.emit('hi', 'Hello from server');
    console.log('Hi', client.id, ack);
  }

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

    const ack = this.server.to(clientId).emit('notification', message);
    if (!ack)
      throw new InternalServerErrorException('Notification not sent', email);
  }
}
