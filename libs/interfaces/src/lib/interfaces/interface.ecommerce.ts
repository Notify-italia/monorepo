export interface INotifyEcommerceProduct {
  id: string;
  name: string;
  price: number;
  hero: string;
  type: 'notify' | 'reviews';
  long_description: string;
  short_description: string;
  images: string[];
  options: {
    usersInfo?: boolean;
    userCount?: boolean;
    noQuantity?: boolean;
    uploadLogo?: boolean;
    colors?: {
      label: string;
      id: string;
      thumbnail: string;
      image: string;
    }[];
    qrCode?: boolean;
  };
}

export interface INotifyEcommerceCart {
  createdAt: string;
  updateAt?: string;
  items: {
    product: string;
    quantity: number;
    price: number;
    name: string;
    options: {
      users?: number;
      color?: string;
      qrCode?: string;
    }[];
  }[];
}
