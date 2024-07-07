import { Notification, NotificationModel } from '@notify/nfc-api-core';
import { SocketEmitNewNotification } from '../socketio/events-emitters/socket.emit.new-notification';

export const createNotification = async (
  notification: Partial<Notification>
) => {
  const noti = NotificationModel.build(notification);

  await noti.save();

  SocketEmitNewNotification(String(noti.owner));

  return noti;
};
