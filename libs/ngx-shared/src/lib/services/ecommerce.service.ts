import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  INotifyEcommerceCart,
  INotifyEcommerceProduct,
  UnknownType,
} from '@notify/interfaces';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class EcommerceService {
  private _http = inject(HttpService);
  private _toast = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);

  private _lsCustomerId = 'notify-ecommerce-customer-id';
  private _lsCart = 'notify-ecommerce-cart';

  public get notifyProducts() {
    return this.products.filter((product) => product.type === 'notify');
  }

  public get reviewsProducts() {
    return this.products.filter((product) => product.type === 'reviews');
  }

  public get customerId() {
    return localStorage.getItem(this._lsCustomerId);
  }

  public get cart(): INotifyEcommerceCart {
    if (!this._isBrowser) {
      return {
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        items: [],
      };
    }
    const result = JSON.parse(localStorage.getItem(this._lsCart) || '{}');

    return {
      createdAt: result.createdAt,
      updateAt: result.updateAt,
      items: result.items,
    };
  }

  public get cartTotal() {
    return this.cart.items
      .map((i) => ({
        ...i,
        quantity: i.options.userCount || i.quantity || 1,
      }))
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  private get _isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  constructor(@Inject('products') public products: INotifyEcommerceProduct[]) {}

  public init() {
    if (!this._isBrowser) {
      return;
    }

    if (!this.customerId) {
      this._generateCustomerId();
    }

    if (!localStorage.getItem(this._lsCart)) {
      this._generateCart();
    }
    console.log(`ecommerce service initialized`, this.cart);
  }

  public clearCart() {
    localStorage.removeItem(this._lsCart);
    this._generateCart();
  }

  public goToCheckout(cart: INotifyEcommerceCart) {
    if (!this._isBrowser) {
      return;
    }

    this._http
      .post<{ cart: INotifyEcommerceCart }, { checkout_url: string }>(
        '/v1/sales/checkout',
        {
          cart: cart,
        }
      )
      .pipe(
        tap((v) => {
          console.log('checkout response', v);
          window.open(v.checkout_url, '_self');
        })
      )
      .subscribe();
  }

  public removeFromCart(index: number) {
    const cart = this.cart;
    cart.updateAt = new Date().toISOString();

    cart.items.splice(index, 1);
    localStorage.setItem(this._lsCart, JSON.stringify(cart));

    this._toast.info('Prodotto rimosso dal carrello');
    console.log('cart updated', this.cart);
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
      price: product.price,
      name: product.name,
      options: parsedOptions,
    });
    localStorage.setItem(this._lsCart, JSON.stringify(cart));

    this._toast.success('Prodotto aggiunto al carrello');
    console.log('cart updated', this.cart);
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

export const provideEcommerceService = (
  products: INotifyEcommerceProduct[]
) => {
  return [
    {
      provide: 'products',
      useValue: products,
    },
    EcommerceService,
  ];
};
