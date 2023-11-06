export interface INotifyProfile<T = EnumNotifyProfileType> {
  _id: string;
  createdAt: string;
  name: string | null;
  surname: T extends EnumNotifyProfileType.agent ? string : null;
  email: string | null;
  phoneNumber: string | null;
  bio: string | null;
  avatar: string | null;
  config: {
    whatsappEnabled: boolean;
    phoneCallEnabled: boolean;
    emailEnabled: boolean;
  };
  customFields: { iconName: string; value: string }[];
  type: T;
  company: T extends EnumNotifyProfileType.agent ? INotifyProfile : null;
}

export enum EnumNotifyProfileType {
  agent = 'agent',
  company = 'company',
}
