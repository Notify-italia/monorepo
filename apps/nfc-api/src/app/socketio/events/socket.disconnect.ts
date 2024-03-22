import { EnumSocketIOSystemEvents, ISocketIo } from '@notify/interfaces';
import { Socket } from 'socket.io';

import { SocketsConnectionsManager, getHeaders } from '../service.socket';

export const socketEventDisconnect = (
  io: ISocketIo,
  socket: Socket,
  connections: SocketsConnectionsManager
) => {
  socket.on(EnumSocketIOSystemEvents.Disconnect, () => {
    const { userinfo } = getHeaders(socket);

    socket.disconnect();

    connections.remove(JSON.parse(userinfo as unknown as string));
  });
};
