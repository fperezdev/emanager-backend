import { NestFactory } from '@nestjs/core';
import { EmAuthModule } from './em-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(EmAuthModule);
  await app.listen(3000);
}
bootstrap();
