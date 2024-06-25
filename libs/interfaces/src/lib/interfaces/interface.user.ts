import mongoose, { Document } from 'mongoose';
import { INotifyAgent } from './models/interface.agent';
import { INotifyCompany } from './models/interface.company';
export interface INotifyUser extends INotifyAgent, INotifyCompany {
  iat: number;
  exp: number;
  userType: EnumNotifyUserType;
  token?: string;
}

export type UserDocument = Document<unknown, unknown, INotifyUser> &
  INotifyUser &
  Required<{
    _id: mongoose.Types.ObjectId;
  }>;

export interface INotifyAccount extends INotifyAgent, INotifyCompany {}

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

export interface INotifyPartialUser extends Partial<INotifyUser> {
  role?: string;
}
