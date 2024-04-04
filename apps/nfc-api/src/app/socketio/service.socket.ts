import { INotifyProfile, ISocketUserInfo } from '@notify/interfaces';
import { Socket } from 'socket.io';

export const profileRoom = (profile: INotifyProfile['_id']) => {
  return `profile:${profile}`;
};

export const ownerRoom = (owner: INotifyProfile['owner']) => {
  return `owner:${owner}`;
};

export const selfRoom = (id: string) => {
  return `self:${id}`;
};

export const getHeaders = (socket: Socket) => {
  return socket.handshake.headers as unknown as {
    profile: string;
    owner: string;
    userinfo: ISocketUserInfo;
  };
};
