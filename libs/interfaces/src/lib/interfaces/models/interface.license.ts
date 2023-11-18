export interface INotifyLicense {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
  enabled: boolean;
  publicKey: string;
  //createdBy: Types.ObjectId;
}
