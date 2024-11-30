import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  INotifyEcommerceCart,
  INotifyEcommerceCartItem,
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
  private _sanitizer = inject(DomSanitizer);

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

  public populateCart() {
    return this.cart.items.map((item) => {
      const productData = this.products.find(
        (product) => product.id === item.product
      );

      return {
        ...item,
        total:
          (item.quantity || item.options.userCount || 1) *
          (productData?.price || 0),
        price:
          item.options.userCount && productData?.options.noQuantity
            ? item.price * item.options.userCount
            : item.price,
        product_data: productData,
        description: this._createItemDescription(item, productData),
      };
    });
  }

  public goToCheckout() {
    if (!this._isBrowser) {
      return;
    }

    const normalized = {
      ...this.cart,
      items: this.populateCart().map((item) => ({
        ...item,
        description: '',
        product_data: undefined,
      })),
    };

    this._http
      .post<{ cart: INotifyEcommerceCart }, { checkout_url: string }>(
        '/v1/sales/checkout',
        {
          cart: normalized,
        }
      )
      .pipe(tap((v) => window.open(v.checkout_url, '_self')))
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
      stripeProductId: product.stripeProductId,
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

  private _createItemDescription(
    item: INotifyEcommerceCartItem,
    productData?: INotifyEcommerceProduct
  ) {
    const labels: { [key: string]: string } = {};

    if (item.options.color) {
      labels['color'] =
        productData?.options.colors?.find((v) => v.id === item.options.color)
          ?.label || '';
    }

    if (item.options.logo) {
      labels['logo'] = `${item.options.logo.filename}`;
    }

    if (item.options.usersInfo) {
      labels['usersInfo'] = `<ul>
      ${item.options.usersInfo
        .map((info, i) => `<li>${i + 1}. ${info.alias}</li>`)
        .join('')}
       </ul>`;
    }

    if (item.options.companyName) {
      const _name = item.options.companyName
        .trim()
        .replace('https://', '')
        .replace('www.', '');
      const _threshold = 50;
      labels['companyName'] =
        _name.length > _threshold ? `${_name.slice(0, _threshold)}...` : _name;
    }

    // if (item.options.userCount) {
    //   labels['userCount'] = `${item.options.userCount} Utenti`;
    // }

    if (productData?.options.includesLicense) {
      labels['license'] = '<small>Licenza notify inclusa</small>';
    }

    return this._sanitizer
      .bypassSecurityTrustHtml(`<div class="flex flex-col space-y-2">
      ${Object.keys(labels)
        .map((key) => `<div>${labels[key].toUpperCase()}</div>`)
        .join('')}
        </div>
        `);
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
