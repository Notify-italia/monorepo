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
  address: T extends EnumNotifyUserType.Company
    ? {
        street: string | null;
        city: string | null;
        number: string | null;
      }
    : null;
  reviewRedirect: T extends EnumNotifyUserType.Company ? string : null;
  config: {
    avatarMask: DaisyUIAvatarMasks | null;
    whatsappEnabled: boolean;
    phoneCallEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
  };
  customFields: { iconName: string; value: string }[];
  type: EnumNotifyUserType;
  //TODO aggiungi open hours (solo azienda)
  openHours: { start: number; end: number }[];
  company?: INotifyProfile<EnumNotifyUserType.Company>;
  colors: {
    background: string[];
    elements: string;
  };
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
] as const;

export const daisyUIAvatarMaksIT: {
  [key in DaisyUIAvatarMasks]: string;
} = {
  circle: 'circolare',
  square: 'quadrato',
  squircle: 'squircle',
  heart: 'cuore',
  hexagon: 'esagono',
  'hexagon-2': 'esagono-2',
  decagon: 'decagono',
  pentagon: 'pentagono',
  diamond: 'diamante',
  parallelogram: 'parallelogramma',
  'parallelogram-2': 'parallelogramma-2',
  'parallelogram-3': 'parallelogramma-3',
  'parallelogram-4': 'parallelogramma-4',
  star: 'stella',
  'star-2': 'stella-2',
  triangle: 'triangolo',
  'triangle-2': 'triangolo-2',
  'triangle-3': 'triangolo-3',
  'triangle-4': 'triangolo-4',
};

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
