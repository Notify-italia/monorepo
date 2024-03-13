import { EnumSocketIOSystemEvents, ISocketUserInfo } from '@notify/interfaces';
import { Server, Socket } from 'socket.io';
import { server } from '..';
import { socketEventDisconnect } from './events/socket.disconnect';
import { socketEventSendFile } from './events/socket.send-file';
import {
  SocketsConnectionsManager,
  getHeaders,
  ownerRoom,
  profileRoom,
  selfRoom,
} from './service.socket';

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling'],
  perMessageDeflate: true,
  httpCompression: true,
  maxHttpBufferSize: 1e8, //100MB
  pingInterval: 10000,
  pingTimeout: 5000,
});

const listen = async (callback: Function) => {
  const connections = new SocketsConnectionsManager(io);

  io.on(EnumSocketIOSystemEvents.Connection, async (socket: Socket) => {
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
  });

  return callback();
};

const socketIOServer = {
  listen,
};

export { socketIOServer };
