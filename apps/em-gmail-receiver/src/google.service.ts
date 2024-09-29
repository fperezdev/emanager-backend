import { google, Auth, gmail_v1 } from 'googleapis';
import { Injectable, OnModuleInit } from '@nestjs/common';

interface Message {
  id: string;
  threadId: string;
  labelsIds: string[];
  date: string;
  msgId: string;
  subject: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  contentType: string;
  content: string;
  historyId: string;
  internalDate: string;
}

@Injectable()
export class GoogleService implements OnModuleInit {
  private googleOauthClient: Auth.OAuth2Client;
  private gmail: gmail_v1.Gmail;
  private scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  onModuleInit() {
    // Google Oauth2 client
    this.googleOauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL,
    );

    this.gmail = google.gmail({ version: 'v1' });
  }

  async getMessages(
    email: string,
    accessToken: string,
    lastUserHistoryId: number,
  ) {
    const response = await this.gmail.users.history.list({
      userId: email,
      startHistoryId: lastUserHistoryId.toString(),
      historyTypes: ['messageAdded', 'messageDeleted'],
      access_token: accessToken,
    });
    const { history } = response.data;

    if (!history) {
      console.log('History with no new messages', email, lastUserHistoryId);
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

    const googleAPIMessages = await Promise.all(
      messageIds.map((messageId) =>
        this.gmail.users.messages.get({
          userId: email,
          id: messageId,
          format: 'full',
          access_token: accessToken,
        }),
      ),
    );

    const parsedMessages = googleAPIMessages.map((message) =>
      parseMessage(message.data),
    );

    return parsedMessages;
  }

  getClient() {
    return this.googleOauthClient;
  }

  getScopes() {
    return this.scopes;
  }
}

// Get all needed data from message response
const parseMessage = (messageData: gmail_v1.Schema$Message): Message => {
  const headers = {};
  messageData.payload.headers.forEach((header) => {
    headers[header.name.toLowerCase()] = header.value;
  });

  const { name: fromName, email: from } = splitNameAndEmail(headers['from']);
  const { name: toName, email: to } = splitNameAndEmail(headers['to']);

  const content = messageData.payload.parts
    .filter((part) => part.mimeType.toLowerCase() === 'text/plain')
    .map((part) => {
      const contentBase64 = part.body.data;
      const content = Buffer.from(contentBase64, 'base64').toString('utf8');
      return content;
    })
    .join('\n');

  return {
    id: messageData.id,
    threadId: messageData.threadId,
    labelsIds: messageData.labelIds,
    date: headers['date'],
    msgId: headers['message-id'],
    subject: headers['subject'],
    from,
    to,
    fromName,
    toName,
    contentType: headers['content-type'],
    content,
    historyId: messageData.historyId,
    internalDate: messageData.internalDate,
  };
};

// Split name and email for strings like 'John Doe <john@doe.com>'
const splitNameAndEmail = (text: string) => {
  // Uses regex to get name and email
  const regex = /^(.*)\s<(.+)>$/;
  const result = text.match(regex);

  if (result) {
    const name = result[1];
    const email = result[2];
    return { name, email };
  } else return { name: '', email: text };
};
