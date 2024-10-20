import { Controller, Get, Session, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleCallbackQuery } from './entities/google-callback-query.entity';
import { Response } from 'express';

@Controller('api/v1/em-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('status')
  status() {
    return 'EM Auth server is running';
  }

  @Get('google-oauth/url') // Obtain authetincation url for google oauth
  googleOauthUrl(
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    return this.authService.googleOauthUrl(session, res);
  }

  @Get('google-oauth/callback') // Callback for google oauth
  googleOauthCallback(
    @Query() query: GoogleCallbackQuery,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.googleOauthCallback(query, session);
  }
}
