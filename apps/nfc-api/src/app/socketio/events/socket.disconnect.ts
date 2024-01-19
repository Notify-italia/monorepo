import { EnumSocketIOSystemEvents, ISocketIo } from '@notify/interfaces';
import { Socket } from 'socket.io';

import {
  SocketsConnectionsManager,
  getHeaders,
  userRoom,
} from '../service.socket';

export const socketEventDisconnect = (
  io: ISocketIo,
  socket: Socket,
  connections: SocketsConnectionsManager
) => {
  socket.on(EnumSocketIOSystemEvents.Disconnect, () => {
    const { profile, owner, userinfo } = getHeaders(socket);

    const profileRoom = userRoom(profile as string);
    socket.leave(profileRoom);

    const ownerRoom = userRoom(owner as string);
    socket.leave(ownerRoom);

    socket.disconnect();

    connections.remove(JSON.parse(userinfo as string));

    console.log(`User left ${profileRoom}`);
  });
};
