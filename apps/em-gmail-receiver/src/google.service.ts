import { PubSub } from '@google-cloud/pubsub';
import { google, gmail_v1 } from 'googleapis';
import { Injectable } from '@nestjs/common';

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const PROCESSOR_TOPIC = process.env.PROCESSOR_TOPIC;

@Injectable()
export class GoogleService {
  async getMessages(
    email: string,
    accessToken: string,
    refreshToken: string,
    lastUserHistoryId: number,
  ): Promise<gmail_v1.Schema$Message[]> {
    const googleOauthClient = createOauthClient();
    googleOauthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: googleOauthClient });

    const response = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: lastUserHistoryId.toString(),
      historyTypes: ['messageAdded', 'messageDeleted'],
    });

    const { history } = response.data;

    if (!history) {
      console.log(
        new Date(),
        'History with no new messages',
        email,
        lastUserHistoryId,
      );
      return [];
    }

    const messageIds = [
      ...new Set(
        history
          .filter((h) => h.messagesAdded)
          .map((h) => h.messagesAdded.map((m) => m.message.id))
          .flat(),
      ),
    ];

    const messages: gmail_v1.Schema$Message[] = [];

    for (const messageId of messageIds) {
      try {
        const message = await gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full',
        });
        messages.push(message.data);
      } catch (error) {
        console.error('Error fetching message', messageId, error);
      }
    }

    return messages;
  }

  async publishMessages(messages: gmail_v1.Schema$Message[]) {
    const pubSubClient = new PubSub({ projectId: GCP_PROJECT_ID });

    for (const message of messages) {
      const dataBuffer = Buffer.from(JSON.stringify(message));

      const messageId = await pubSubClient
        .topic(PROCESSOR_TOPIC)
        .publishMessage({ data: dataBuffer });

      console.log(
        `Message ${messageId} published`,
        GCP_PROJECT_ID,
        PROCESSOR_TOPIC,
      );
    }
  }
}

const createOauthClient = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );
