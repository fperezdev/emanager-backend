import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const RECEIVER_TOPIC = process.env.RECEIVER_TOPIC;

const GMAIL_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

@Injectable()
export class GoogleService {
  constructor(private prismaService: PrismaService) {}

  getAuthUrl(sessionState: string) {
    const googleOauthClient = createOauthClient();

    return googleOauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: GMAIL_OAUTH_SCOPES,
      include_granted_scopes: false,
      // Include the state parameter to reduce the risk of CSRF attacks.
      state: sessionState,
    });
  }

  // Start watching the user's email on callback
  async watch(code: string): Promise<string | null> {
    const googleOauthClient = createOauthClient();

    const { tokens } = await googleOauthClient.getToken(code);
    googleOauthClient.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: googleOauthClient });
    const response = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: RECEIVER_TOPIC,
      },
    });

    const { historyId } = response.data;

    const { access_token: accessToken } = tokens;
    const { email } = await googleOauthClient.getTokenInfo(accessToken);

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
        lastHistoryId: Number(historyId),
      },
    });

    return email;
  }
}

const createOauthClient = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );
