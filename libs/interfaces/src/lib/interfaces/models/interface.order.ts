import { MongodbDocument } from '../interface.mongodb';
import { INotifyEcommerceCart } from './interface.cart';

enum EcommerceOrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

export interface INotifyEcommerceOrder extends MongodbDocument {
  cart: INotifyEcommerceCart['_id'];
  status: EcommerceOrderStatus;
  trackingNumber: string;
  customerId: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  orderId: string;
}
