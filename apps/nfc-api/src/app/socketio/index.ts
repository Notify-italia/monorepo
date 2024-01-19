import { Server, Socket } from 'socket.io';
import { server } from '..';
import { socketEventDisconnect } from './events/socket.disconnect';
import {
  SocketsConnectionsManager,
  getHeaders,
  userRoom,
} from './service.socket';

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling'],
  perMessageDeflate: true,
  httpCompression: true,
  maxHttpBufferSize: 1e8, //100MB
});

const listen = async (callback: Function) => {
  const connections = new SocketsConnectionsManager(io);

  io.on('connection', async (socket: Socket) => {
    const headers = getHeaders(socket);

    //get the profile room from the given id
    const profileRoom = userRoom(headers.profile);

    //join the profile room
    socket.join(profileRoom);

    if (headers.owner) {
      //if the owner is present, join the owner room
      const ownerRoom = userRoom(headers.owner);
      socket.join(ownerRoom);
    }

    connections.add(
      JSON.parse(headers.userinfo as unknown as string),
      profileRoom
    );

    socketEventDisconnect(io, socket, connections);
  });

  return callback();
};

const socketIOServer = {
  listen,
};

export { socketIOServer };
