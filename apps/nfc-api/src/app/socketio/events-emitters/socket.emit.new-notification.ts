import {
  EnumSocketIONotificationsEvents,
  INotifyUser,
} from '@notify/interfaces';
import { SocketIoInstance } from '@notify/nfc-api-core';
import { selfRoom } from '../service.socket';

export const SocketEmitNewNotification = (
  user: INotifyUser['_id']
  //   content: INotifyNotification
) => {
  const userRoom = selfRoom(user);

  console.log(`Emitting new notification to ${userRoom}`);

  SocketIoInstance.in(userRoom).emit(
    EnumSocketIONotificationsEvents.IncreaseNotificationCount
  );
};
