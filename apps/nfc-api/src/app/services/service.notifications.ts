import {
  asyncForEach,
  Notification,
  NotificationModel,
  queryUsers,
  sendFCMNotification,
} from '@notify/nfc-api-core';
import { SocketEmitNewNotification } from '../socketio/events-emitters/socket.emit.new-notification';

export const createNotification = async (
  notification: Partial<Notification>,
  notificationSubtitle?: string
) => {
  const noti = NotificationModel.build(notification);

  await noti.save();

  const foundUser = await queryUsers({ _id: noti.owner }, true);

  console.log(`Sending push notification to ${foundUser.email}`);
  await asyncForEach(foundUser.fcmTokens, async (token) => {
    const result = await sendFCMNotification({
      token: token,
      data: {
        notification_id: noti._id.toString(),
      },
      notification: {
        title: noti.title,
        body: notificationSubtitle || '',
      },
    });

    console.log('FCM Notification sent', result);
  });

  SocketEmitNewNotification(String(noti.owner));

  return noti;
};
