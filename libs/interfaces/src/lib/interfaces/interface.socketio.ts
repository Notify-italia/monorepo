import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type ISocketIo = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  unknown
>;

export interface ISocketUserInfo {
  browser: string;
  device: string;
  deviceType: string;
  connectionTimestamp: number;
  id: string;
}

export enum EnumSocketIOSystemEvents {
  Connection = 'connection',
  Disconnect = 'disconnect',
}

export enum EnumSOcketIOProfileEvents {
  ConnectedDevices = 'profile:devices',
  SendFile = 'profile:send-file',
  RecieveFile = 'profile:recieve-file',
}
