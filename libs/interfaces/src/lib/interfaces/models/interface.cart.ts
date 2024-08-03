import { MongodbDocument } from '../interface.mongodb';
import { INotifyEcommerceOrder } from './interface.order';

export interface INotifyEcommerceCart extends MongodbDocument {
  customerId: string;
  orderId: INotifyEcommerceOrder['_id'];
  items: {
    product: string;
    quantity: number;
    price: number;
    options: {
      users?: number;
      color?: string;
      qrCode?: string;
    }[];
  }[];
}
