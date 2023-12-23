import { MongodbDocument } from '../interface.mongodb';
import { EnumNotifyUserType, INotifyUser } from '../interface.user';

export interface INotifyProfile<
  T extends EnumNotifyUserType = EnumNotifyUserType
> extends MongodbDocument {
  owner: INotifyUser['_id'];
  name: string | null;
  surname: T extends EnumNotifyUserType.Agent ? string : null;
  email: string | null;
  phoneNumber: string | null;
  bio: string | null;
  role: string | null;
  avatar: string | null;
  address: string | null;
  config: {
    avatarMask: DaisyUIAvatarMasks | null;
    whatsappEnabled: boolean;
    phoneCallEnabled: boolean;
    emailEnabled: boolean;
  };
  customFields: { iconName: string; value: string }[];
  type: EnumNotifyUserType;
  company?: INotifyProfile<EnumNotifyUserType.Company>;
}

export const daisyUIAvatarMaks = [
  'circle',
  'square',
  'squircle',
  'heart',
  'hexagon',
  'hexagon-2',
  'decagon',
  'pentagon',
  'diamond',
  'parallelogram',
  'parallelogram-2',
  'parallelogram-3',
  'parallelogram-4',
  'star',
  'star-2',
  'triangle',
  'triangle-2',
  'triangle-3',
  'triangle-4',
  'half-1',
  'half-2',
] as const;

export type DaisyUIAvatarMasks = (typeof daisyUIAvatarMaks)[number];

export const defaultAvatarMask = (type: EnumNotifyUserType) => {
  switch (type) {
    case EnumNotifyUserType.Agent:
      return 'circle';
    case EnumNotifyUserType.Company:
      return 'squircle';
    default:
      return 'circle';
  }
};
