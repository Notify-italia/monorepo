import { Injectable, inject } from '@angular/core';
import { INotifyEcommerceCart, UnknownType } from '@notify/interfaces';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from './http.service';

export interface INotifyEcommerceProduct {
  id: string;
  name: string;
  price: number;
  hero: string;
  description: string;
  options: {
    users?: boolean;
    colors?: {
      label: string;
      id: string;
      hero: string;
    }[];
    qrCode?: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EcommerceService {
  private _http = inject(HttpService);
  private _toast = inject(ToastrService);

  public products: INotifyEcommerceProduct[] = [
    {
      id: 'license',
      name: 'Solo Licenza',
      price: 19.99,
      hero: '/assets/shop/license.webp',
      description:
        'Se non hai bisogno di una card fisica, questa è la soluzione per te.',
      options: {
        users: true,
      },
    },
  ];

  private _lsCustomerId = 'notify-ecommerce-customer-id';
  private _lsCart = 'notify-ecommerce-cart';

  public get customerId() {
    return localStorage.getItem(this._lsCustomerId);
  }

  public get cart(): INotifyEcommerceCart {
    return JSON.parse(localStorage.getItem(this._lsCart) || '{}');
  }

  public init() {
    if (!this.customerId) {
      this._generateCustomerId();
    }

    if (!localStorage.getItem(this._lsCart)) {
      this._generateCart();
    }
  }

  public addToCart(
    product: INotifyEcommerceProduct,
    quantity: number,
    parsedOptions: {
      [key in keyof INotifyEcommerceCart['items'][0]['options']]: UnknownType;
    }
  ) {
    const cart = this.cart;
    cart.updateAt = new Date().toISOString();

    cart.items.push({
      product: product.id,
      quantity,
      options: parsedOptions,
    });
    localStorage.setItem(this._lsCart, JSON.stringify(cart));

    this._toast.success('Prodotto aggiunto al carrello');
  }

  private _generateCart(): INotifyEcommerceCart {
    const value = {
      createdAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      items: [],
    };

    localStorage.setItem(this._lsCart, JSON.stringify(value));

    return value;
  }

  private _generateCustomerId() {
    const customerId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(this._lsCustomerId, customerId);
  }
}
