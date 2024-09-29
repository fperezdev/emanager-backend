import { NestFactory } from '@nestjs/core';
import { EmGmailReceiverModule } from './em-gmail-receiver.module';

async function bootstrap() {
  const app = await NestFactory.create(EmGmailReceiverModule);
  await app.listen(8080);
}
bootstrap();
