import { google, Auth } from 'googleapis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GoogleService implements OnModuleInit {
  private googleOauthClient: Auth.OAuth2Client;
  private scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  constructor(private prismaService: PrismaService) {}

  onModuleInit() {
    // Google Oauth2 client
    this.googleOauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL,
    );
  }

  // Start watching the user's email on callback
  async watch(code: string): Promise<string | null> {
    const { tokens } = await this.googleOauthClient.getToken(code);
    this.googleOauthClient.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: this.googleOauthClient });
    const result = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: `projects/emanager-44/topics/emanager-messages-topic`,
      },
    });

    if (result.data) {
      const { email } = await this.googleOauthClient.getTokenInfo(
        tokens.access_token,
      );

      await this.prismaService.user.upsert({
        where: { email },
        update: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
        create: {
          email,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      });

      return email;
    } else return null;
  }

  getClient() {
    return this.googleOauthClient;
  }

  getScopes() {
    return this.scopes;
  }
}
