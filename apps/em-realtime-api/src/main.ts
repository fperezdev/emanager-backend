import { NestFactory } from '@nestjs/core';
import { EmRealtimeApiModule } from './em-realtime-api.module';

async function bootstrap() {
  const app = await NestFactory.create(EmRealtimeApiModule);
  await app.listen(3000);
}
bootstrap();
