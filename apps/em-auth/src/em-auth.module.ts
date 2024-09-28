import { Module } from '@nestjs/common';
import { EmAuthController } from './em-auth.controller';
import { EmAuthService } from './em-auth.service';

@Module({
  imports: [],
  controllers: [EmAuthController],
  providers: [EmAuthService],
})
export class EmAuthModule {}
