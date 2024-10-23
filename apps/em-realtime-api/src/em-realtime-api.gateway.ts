import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from './redis.service';
import { Message } from './lib/types';
import { InternalServerErrorException } from '@nestjs/common';
import { EmRealtimeApiService } from './em-realtime-api.service';

@WebSocketGateway({
  path: '/api/v1/em-realtime-api/ws',
  namespace: 'api/v1/em-realtime-api/ws',
  cors: true,
})
export class EmRealtimeApiGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly realtimeService: EmRealtimeApiService,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // TODO - Implement user authentication
    const { email } = client.handshake.query;
    if (typeof email === 'string') {
      this.redisService.set(`${email}-client-id`, client.id);
      const messages = await this.realtimeService.getMessages(email);
      client.emit('connected', messages);
      console.log('Client connected', email, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('getMessages')
  handleMessage(client: Socket, payload: string) {
    const email = payload;
    return this.realtimeService.getMessages(email);
  }

  async sendNotification(email: string, message: Message) {
    const clientId = await this.redisService.get(`${email}-client-id`);
    if (!clientId || clientId === 'null') {
      console.log('Client not found in cache', email);
      return;
    }
    console.log('Sending noti to', email, clientId);

    const ack = this.server.to(clientId).emit('notification', message);
    if (!ack)
      throw new InternalServerErrorException('Notification not sent', email);
  }
}
