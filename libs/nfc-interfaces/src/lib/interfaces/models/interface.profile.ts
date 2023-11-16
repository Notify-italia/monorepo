import { EnumNotifyUserType } from '../interface.user';

//TODO gestisci ruolo agente
export interface INotifyProfile<
  T extends EnumNotifyUserType = EnumNotifyUserType
> {
  _id: string;
  createdAt: string;
  name: string | null;
  surname: T extends EnumNotifyUserType.Agent ? string : null;
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
  type: EnumNotifyUserType;
  company: T extends EnumNotifyUserType.Agent
    ? INotifyProfile<EnumNotifyUserType.Company>
    : null;
}
