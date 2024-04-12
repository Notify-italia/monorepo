import { INotifyProfile } from '@notify/interfaces';

export const profileRoom = (profile: INotifyProfile['_id']) => {
  return `profile:${profile}`;
};

export const ownerRoom = (owner: INotifyProfile['owner']) => {
  return `owner:${owner}`;
};

export const selfRoom = (id: string) => {
  return `self:${id}`;
};
