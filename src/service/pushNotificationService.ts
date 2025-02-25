import axios from 'axios';
import { DeviceTokenLocal } from '../models/deviceTokenModel';
import { IDeviceToken } from '../models/deviceTokenModel';

export async function sendPushNotification(title: string, body: string) {
  try {
    // Get all registered tokens
    const tokensData = await DeviceTokenLocal.find().select('token -_id');
    const tokens = tokensData.map((doc: IDeviceToken) => doc.token);

    if (!tokens.length) {
      console.log("No device tokens found");
      return { success: false, reason: "no_tokens" };
    }

    console.log(`Sending push notification to ${tokens.length} devices`);

    // Prepare messages for Expo Push API
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: { someData: 'may go here' },
    }));

    // Send notification using Expo Push API
    const response = await axios.post(
      'https://exp.host/--/api/v2/push/send', 
      messages.length === 1 ? messages[0] : messages,
      {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30-second timeout
      }
    );

    console.log("Push notification response:", response.data);
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error sending push notifications:", errorMessage);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Push service error response:", error.response.data);
        console.error("Push service error status:", error.response.status);
      } else if (error.request) {
        console.error("No response from push service");
      }
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}
