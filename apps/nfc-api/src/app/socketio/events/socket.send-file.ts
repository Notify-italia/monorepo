import { EnumSOcketIOProfileEvents, ISocketIo } from '@notify/interfaces';
import { Socket } from 'socket.io';

import { selfRoom } from '../service.socket';

export const socketEventSendFile = async (io: ISocketIo, socket: Socket) => {
  socket.on(
    EnumSOcketIOProfileEvents.SendFile,
    async (data: { target: string; fileData: Buffer; fileName: string }) => {
      io.in(selfRoom(data.target)).emit(EnumSOcketIOProfileEvents.RecieveFile, {
        fileData: data.fileData,
        fileName: data.fileName,
      });

      console.log('sent files to', data.target);
    }
  );
};
