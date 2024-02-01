import { INotifyAgent } from './models/interface.agent';
import { INotifyCompany } from './models/interface.company';
import { EnumNotifyStatType } from './models/interface.stat';

export interface INotifyUser extends INotifyAgent, INotifyCompany {
  iat: number;
  exp: number;
  userType: EnumNotifyUserType;
  token?: string;
}

export interface INotifyAccount extends INotifyAgent, INotifyCompany {}

export type INotifyUserStats = {
  [key in
    | EnumNotifyStatType
    | 'profile:feedback:average'
    | 'profile:feedback:count']: number;
};

export interface INotifyAuth {
  email: string;
  password: string;
}

export interface INotifyAccounts {
  [EnumNotifyUserType.Agent]: INotifyAgent;
  [EnumNotifyUserType.Company]: INotifyCompany;
}

export enum EnumNotifyUserType {
  Agent = 'agent',
  Company = 'company',
}
