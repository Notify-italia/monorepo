import {
  EnumSOcketIOProfileEvents,
  INotifyProfile,
  ISocketIo,
  ISocketUserInfo,
} from '@notify/interfaces';
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

export class SocketsConnectionsManager {
  public activeConnections: { sockets: ISocketUserInfo[]; room: string }[] = [];

  constructor(private io: ISocketIo) {}

  public add(user: ISocketUserInfo, room: string) {
    //check if the room already exists
    const existingRoom = this.activeConnections.find(
      (connection) => connection.room === room
    );

    if (!existingRoom) {
      //if the room doesn't exist, create it and add the user
      this.activeConnections.push({ sockets: [user], room });

      //emit to room the new list of connected devices
      this._emitUpdates(room);

      return;
    }

    const userExists = existingRoom.sockets.find((socket) =>
      this._compare(socket, user)
    );

    if (userExists) {
      //if the user already exists, do nothing
      return;
    }

    //if the room exists, push the new user to the list
    existingRoom.sockets.push(user);

    //emit to room the new list of connected devices
    this._emitUpdates(room);
  }

  public remove(user: ISocketUserInfo) {
    const index = this.activeConnections.findIndex((connection) =>
      connection.sockets.find((socket) => this._compare(socket, user))
    );

    if (index === -1) {
      //if the index isn't found (-1) then there is nothing to remove
      return;
    }

    //find the current room of the socket
    const room = this.activeConnections[index].room;

    //remove socket from list
    this.activeConnections[index].sockets = this.activeConnections[
      index
    ].sockets.filter((socket) => !this._compare(socket, user));

    //emit to room the new list of connected devices
    this._emitUpdates(room);
  }

  private _compare(source: ISocketUserInfo, target: ISocketUserInfo) {
    return source.id === target.id;
  }

  private _socketsInRoom(room: string) {
    return this.activeConnections.find((connection) => connection.room === room)
      ?.sockets;
  }

  private _emitUpdates(room: string) {
    this.io
      .in(room)
      .emit(
        EnumSOcketIOProfileEvents.ConnectedDevices,
        this._socketsInRoom(room)
      );
  }
}
