import { ISocketUserInfo } from '@notify/interfaces';
import { Server, Socket } from 'socket.io';

import { SocketsConnectionsManager } from '@notify/nfc-api-core';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { socketEventDisconnect } from './events/socket.disconnect';
import { socketEventSendFile } from './events/socket.send-file';
import { getHeaders, ownerRoom, profileRoom, selfRoom } from './service.socket';

export const socketEvents = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket,
  connections: SocketsConnectionsManager
) => {
  const headers = getHeaders(socket);

  const parsedUser: ISocketUserInfo = JSON.parse(
    headers.userinfo as unknown as string
  );

  //get the profile room from the given id
  const _profileRoom = profileRoom(headers.profile);

  //get the self room from the given id
  const _selfRoom = selfRoom(parsedUser.id);

  //join the profile room
  socket.join(_profileRoom);

  //join its own room
  socket.join(_selfRoom);

  if (headers.owner) {
    //if the owner is present, join the owner room
    const _ownerRoom = ownerRoom(headers.owner);
    socket.join(_ownerRoom);
  }

  connections.add(parsedUser, _profileRoom);

  socketEventDisconnect(io, socket, connections);
  socketEventSendFile(io, socket);
};
