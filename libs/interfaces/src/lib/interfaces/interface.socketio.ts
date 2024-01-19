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
  Disconnect = 'system:disconnect',
}

export enum EnumSOcketIOProfileEvents {
  ConnectedDevices = 'profile:devices',
}
