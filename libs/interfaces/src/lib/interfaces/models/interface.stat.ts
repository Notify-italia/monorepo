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

export type INotifyUserStats = {
  [key in EnumNotifyStatType]: number;
};

export enum EnumNotifyStatType {
  ProfileVisit = 'profile:visit',
  ProfileSave = 'profile:save',
  ProfileReturn = 'profile:return',
  PrifileStaticContactsClick = 'profile:static-contacts:click',
  ProfileFeedbackTotalRating = 'profile:feedback:rating',
  ProfileFeedbackCount = 'profile:feedback:count',
  ProfileIntegrationCount = `profile:integrations:item:{{integration}}:count`,
}
