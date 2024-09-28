import * as crypto from 'crypto';
import {
  HttpCode,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleService } from './google.service';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private googleService: GoogleService,
    private prismaService: PrismaService,
  ) {}

  googleOauthUrl(session: Record<string, any>, res: Response) {
    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString('hex');
    // Store state in the session
    session.state = state;

    const authUrl = this.googleService.getClient().generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      scope: this.googleService.getScopes(),
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: false,
      // Include the state parameter to reduce the risk of CSRF attacks.
      state: state,
    });

    return res.redirect(authUrl);
  }

  @HttpCode(200)
  async googleOauthCallback(query: any, session: Record<string, any>) {
    if (query.error) {
      console.error('Error handling google callback:' + query.error);
      throw new InternalServerErrorException('Error in callback query');
    } else if (query.state !== session.state) {
      console.warn('State mismatch. Possible CSRF attack');
      throw new UnauthorizedException('Dangerous request');
    } else if (query.code) {
      const watchedUser = await this.googleService.watch(query.code);
      if (watchedUser) return "You're all set!";
      else {
        console.error('Error watching user', query.code);
        throw new InternalServerErrorException('Error watching user');
      }
    }
  }
}
