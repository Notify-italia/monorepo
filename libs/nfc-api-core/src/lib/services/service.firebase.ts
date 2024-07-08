import { google } from 'googleapis';
import { declareEnvs } from './service.envs';
import { mLog } from './service.managed-logs';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
  declareEnvs([
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ]);

export const getGoogleAccessToken = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: FIREBASE_CLIENT_EMAIL,
      private_key: FIREBASE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  return await auth.getAccessToken();
};

export const sendFCMNotification = async (options: {
  token: string;
  data: { [key: string]: string };
  notification: { title: string; body: string };
}) => {
  try {
    const accessToken = await getGoogleAccessToken();

    console.log(accessToken, options);

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`,
      {
        method: 'POST',
        body: JSON.stringify({ message: options }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return await response.json();
  } catch (error) {
    mLog(`Error sending FCM notification: ${error}`, 'error');
  }
};
