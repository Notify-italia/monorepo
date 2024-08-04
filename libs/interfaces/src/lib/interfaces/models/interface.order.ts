import { MongodbDocument } from '../interface.mongodb';

enum EcommerceOrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

export interface INotifyEcommerceOrder extends MongodbDocument {
  status: EcommerceOrderStatus;
  trackingNumber: string;
  customerId: string;
  cart: INotifyEcommerceCart;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  orderId: string;
}

export interface INotifyEcommerceCart {
  createdAt: string;
  updateAt?: string;
  items: {
    product: string;
    quantity: number;
    options: {
      users?: number;
      color?: string;
      qrCode?: string;
    }[];
  }[];
}
