import { MongodbDocument } from '../interface.mongodb';
import { INotifyCompany } from './interface.company';

export const FEATURES = [
  'dashboard',
  'profile',
  'shareFiles',
  'leads',
  'notes',
  'colleagues',
  'sub-users',
  'profile-company',
  'stats',
] as const;

export type FeatureName = (typeof FEATURES)[number];

export interface INotifyLicense extends MongodbDocument {
  expirationDate: Date;
  enabled: boolean;
  publicKey: string;
  allowedAgents: number;
  features: {
    type: 'include' | 'exclude';
    name: FeatureName;
  }[];
  boughtCards: number;
}

export type INotifyPopulatedLicense = INotifyLicense & {
  company: INotifyCompany<true>;
  agents?: number;
};
