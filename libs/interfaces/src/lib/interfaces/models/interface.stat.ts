import { MongodbDocument } from '../interface.mongodb';
import { INotifyUser } from '../interface.user';

export interface INotifyStat extends MongodbDocument {
  type: EnumNotifyStatType;
  owner: INotifyUser['_id'];
  period: {
    from: Date;
    to: Date;
  };
  value: number;
}

export enum EnumNotifyStatType {
  ProfileVisit = 'profile:visit',
  ProfileSave = 'profile:save',
  ProfileReturn = 'profile:return',
  ProfileContactsClick = 'profile:contacts:click',
  ProfileIntegrationsClick = 'profile:integrations:click',
}
