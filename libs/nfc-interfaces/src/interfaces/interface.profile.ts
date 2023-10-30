export interface INotifyProfile<T = EnumNotifyProfileType> {
  _id: string;
  createdAt: string;
  name: string;
  surname: T extends EnumNotifyProfileType.agent ? string : null;
  email: string;
  phoneNumber: string;
  bio: string;
  avatar: string;
  config: {
    whatsappEnabled: boolean;
    phoneCallEnabled: boolean;
    emailEnabled: boolean;
  };
  customFields: { iconName: string; value: string }[];
  type: T;
  company: T extends EnumNotifyProfileType.agent ? INotifyProfile : undefined;
}

export enum EnumNotifyProfileType {
  agent = 'agent',
  company = 'company',
}
