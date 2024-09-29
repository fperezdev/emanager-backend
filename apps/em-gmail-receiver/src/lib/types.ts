export interface PushNotificationBody {
  message: {
    // This is the actual notification data, as base64url-encoded JSON.
    data: string;
    // This is a Cloud Pub/Sub message id, unrelated to Gmail messages.
    messageId: string;
    // This is the publish time of the message.
    publishTime: string;
  };

  subscription: string;
}

export interface PushNotificationData {
  emailAddress: string;
  historyId: number;
}
