import { EnumNotifyAccountType } from '../interface.user';

export interface INotifyProfile<
  T extends EnumNotifyAccountType = EnumNotifyAccountType
> {
  _id: string;
  createdAt: string;
  name: string | null;
  surname: T extends EnumNotifyAccountType.agent ? string : null;
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
  type: EnumNotifyAccountType;
  company: T extends EnumNotifyAccountType.agent
    ? INotifyProfile<EnumNotifyAccountType.company>
    : null;
}
