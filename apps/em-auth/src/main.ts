import { NestFactory } from '@nestjs/core';
import { EmAuthModule } from './em-auth.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(EmAuthModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
