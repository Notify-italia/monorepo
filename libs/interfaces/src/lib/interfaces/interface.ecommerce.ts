export interface INotifyEcommerceProduct {
  id: string;
  stripeProductId?: string;
  name: string;
  price: number;
  hero: string;
  type: 'notify' | 'reviews';
  long_description: string;
  short_description: string;
  images: string[];
  options: {
    companyName?: {
      enabled: boolean;
      label: string;
      placeholder: string;
    };
    usersInfo?: boolean;
    userCount?: boolean;
    noQuantity?: boolean;
    logo?: boolean;
    colors?: {
      label: string;
      id: string;
      thumbnail: string;
      image: string;
    }[];
    qrCode?: boolean;
    includesLicense?: boolean;
  };
}

export interface INotifyEcommerceCartItem {
  product: string;
  quantity: number;
  stripeProductId?: string;
  price: number;
  name: string;
  options: {
    includesLicense?: boolean;
    usersInfo?: { alias: string }[];
    userCount?: number;
    logo?: {
      filename: string;
      url?: string;
      blob?: string;
    };
    companyName?: string;
    color?: string;
    qrCode?: string;
  };
}

export interface INotifyEcommerceCart {
  createdAt: string;
  updateAt?: string;
  items: INotifyEcommerceCartItem[];
}
