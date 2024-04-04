import { EnumSocketIOSystemEvents } from '@notify/interfaces';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { SocketsConnectionsManager } from './services/service.socket-connections-manager';

export const initSocketio = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  events: (
    io: Server,
    socket: Socket,
    connections: SocketsConnectionsManager
  ) => void
) => {
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

  return {
    listen: async (callback: () => any) => {
      const connections = new SocketsConnectionsManager(io);

      io.on(EnumSocketIOSystemEvents.Connection, async (socket: Socket) => {
        events(io, socket, connections);
      });

      return callback();
    },
  };
};
