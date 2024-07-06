import { EnumSocketIOProfileEvents, ISocketIo } from '@notify/interfaces';
import { Socket } from 'socket.io';
import { selfRoom } from '../service.socket';

export const socketHandleSendFileEvent = async (
  io: ISocketIo,
  socket: Socket
) => {
  socket.on(
    EnumSocketIOProfileEvents.SendFile,
    async (data: { target: string; fileData: Buffer; fileName: string }) => {
      io.in(selfRoom(data.target)).emit(EnumSocketIOProfileEvents.RecieveFile, {
        fileData: data.fileData,
        fileName: data.fileName,
      });

      console.log('sent files to', data.target);
    }
  );
};
