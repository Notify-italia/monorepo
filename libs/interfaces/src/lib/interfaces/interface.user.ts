import { INotifyAgent } from './models/interface.agent';
import { INotifyCompany } from './models/interface.company';

export interface INotifyUser extends INotifyAgent, INotifyCompany {
  iat: number;
  exp: number;
  userType: EnumNotifyUserType;
  token?: string;
}

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
