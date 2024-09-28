import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { GoogleService } from './auth/google.service';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleService, PrismaService],
})
export class EmAuthModule {}
