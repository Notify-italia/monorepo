import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
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

  public products: INotifyEcommerceProduct[] = [
    {
      id: 'tier-1',
      type: 'notify',
      name: 'Basic PVC ',
      price: 29.99,
      hero: '/assets/shop/tier-1.webp',
      images: [
        '/assets/shop/Tessere shop - Nero.webp',
        '/assets/shop/Tessere shop - Rosa.webp',
        '/assets/shop/Tessere shop - Rosso.webp',
        '/assets/shop/Tessere shop - Verde.webp',
        '/assets/shop/Tessere shop - Blu.webp',
        '/assets/shop/Tessere shop - Banana pattern Azzurro.webp',
        '/assets/shop/Tessere shop - Banana pattern Fucsia.webp',
        '/assets/shop/Tessere shop - Banana pattern Giallo.webp',
        '/assets/shop/Tessere shop - Hexagon Pattern Azzurro.webp',
        '/assets/shop/Tessere shop - Hexagon Pattern Fucsia.webp',
        '/assets/shop/Tessere shop - Hexagon Pattern Giallo.webp',
        '/assets/shop/Tessere shop - Hive Pattern Giallo.webp',
        '/assets/shop/Tessere shop - Hive Pattern Azzurro.webp',
        '/assets/shop/Tessere shop - Hive Pattern Fucsia.webp',
      ],
      short_description:
        'Una card in PVC con grafica Notify, disponibile in diversi stili.',
      long_description: `Le nostre cards Basic PVC sono perfette per chi vuole entrare nel mondo Notify con un prodotto di qualità ad un prezzo accessibile.
        Le cards Basic PVC sono disponibili in diversi stili e colori.
\n
        Acquistando una card Basic PVC riceverai:
        - La card con lo stile che hai scelto.
        - Una licenza d'uso per Notify (in caso di acquisto multiplo sarà aggiunto uno slot utente alla licenza ricevuta).
        `,
      options: {
        usersInfo: false,
        qrCode: true,
        colors: [
          {
            label: 'Nero',
            id: 'nero',
            thumbnail: '/assets/cards/pastello/black_thumb.webp',
            image: '/assets/shop/Tessere shop - Nero.webp',
          },
          {
            label: 'Rosa',
            id: 'rosa',
            thumbnail: '/assets/cards/pastello/pink_thumb.webp',
            image: '/assets/shop/Tessere shop - Rosa.webp',
          },
          {
            label: 'Rosso',
            id: 'rosso',
            thumbnail: '/assets/cards/pastello/red_thumb.webp',
            image: '/assets/shop/Tessere shop - Rosso.webp',
          },
          {
            label: 'Blu',
            id: 'blu',
            thumbnail: '/assets/cards/pastello/blue_thumb.webp',
            image: '/assets/shop/Tessere shop - Blu.webp',
          },
          {
            label: 'Verde',
            id: 'verde',
            thumbnail: '/assets/cards/pastello/green_thumb.webp',
            image: '/assets/shop/Tessere shop - Verde.webp',
          },
          {
            label: 'Banana Pattern Azzurro',
            id: 'banana-azzurro',
            thumbnail: '/assets/cards/vermicelli/river_thumb.webp',
            image: '/assets/shop/Tessere shop - Banana pattern Azzurro.webp',
          },
          {
            label: 'Banana Pattern Fucsia',
            id: 'banana-fucsia',
            thumbnail: '/assets/cards/vermicelli/neon_thumb.webp',
            image: '/assets/shop/Tessere shop - Banana pattern Fucsia.webp',
          },
          {
            label: 'Banana Pattern Giallo',
            id: 'banana-giallo',
            thumbnail: '/assets/cards/vermicelli/banana_thumb.webp',
            image: '/assets/shop/Tessere shop - Banana pattern Giallo.webp',
          },
          {
            label: 'Hexagon Pattern Azzurro',
            id: 'cubi-azzurro',
            thumbnail: '/assets/cards/rombi/river_thumb.webp',
            image: '/assets/shop/Tessere shop - Hexagon Pattern Azzurro.webp',
          },
          {
            label: 'Hexagon Pattern Fucsia',
            id: 'cubi-fucsia',
            thumbnail: '/assets/cards/rombi/neon_thumb.webp',
            image: '/assets/shop/Tessere shop - Hexagon Pattern Fucsia.webp',
          },
          {
            label: 'Hexagon Pattern Giallo',
            id: 'cubi-giallo',
            thumbnail: '/assets/cards/rombi/banana_thumb.webp',
            image: '/assets/shop/Tessere shop - Hexagon Pattern Giallo.webp',
          },
          {
            label: 'Hive Pattern Azzurro',
            id: 'Hive-azzurro',
            thumbnail: '/assets/cards/esagoni/river_thumb.webp',
            image: '/assets/shop/Tessere shop - Hive Pattern Azzurro.webp',
          },
          {
            label: 'Hive Pattern Fucsia',
            id: 'Hive-fucsia',
            thumbnail: '/assets/cards/esagoni/neon_thumb.webp',
            image: '/assets/shop/Tessere shop - Hive Pattern Fucsia.webp',
          },
          {
            label: 'Hive Pattern Giallo',
            id: 'Hive-giallo',
            thumbnail: '/assets/cards/esagoni/banana_thumb.webp',
            image: '/assets/shop/Tessere shop - Hive Pattern Giallo.webp',
          },
        ],
        includesLicense: true,
      },
    },
    {
      id: 'tier-2',
      long_description: `Le nostre cards Personal PVC sono perfette per chi valorizza la propria identità e vuole distinguersi con una card unica, pur mantendo uno stile pulito e minimalista. Le cards Personal PVC sono disponibili in stile light e dark.
        \n
        Acquistando una card Basic PVC riceverai:
        - La card con lo stile che hai scelto.
        - Una licenza d'uso per Notify (in caso di acquisto multiplo sarà aggiunto uno slot utente alla licenza ricevuta).`,
      type: 'notify',
      name: 'Personal PVC',
      price: 34.99,
      hero: '/assets/shop/tier-2.webp',
      images: [
        '/assets/shop/Tessere shop - Tier2 - Nero.webp',
        '/assets/shop/Tessere shop - Tier2 - Bianco.webp',
      ],
      short_description:
        'Una card in PVC con logo e nome personalizzati, disponibile in 2 stili.',
      options: {
        usersInfo: true,
        logo: true,
        qrCode: true,
        includesLicense: true,
        colors: [
          {
            label: 'Bianco',
            id: 'white',
            thumbnail: '/assets/cards/personal/white_thumb.webp',
            image: '/assets/shop/Tessere shop - Tier2 - Bianco.webp',
          },
          {
            label: 'Nero',
            id: 'black',
            thumbnail: '/assets/cards/personal/black_thumb.webp',
            image: '/assets/shop/Tessere shop - Tier2 - Nero.webp',
          },
        ],
      },
    },
    {
      id: 'tier-3',
      long_description: '',
      images: [],
      type: 'notify',
      name: 'Custom PVC',
      price: 44.99,
      hero: '/assets/shop/tier-1.webp',
      short_description:
        'Una card in PVC personalizzabile nella sua interezza.',
      options: {
        qrCode: true,
        includesLicense: true,
      },
    },
    {
      id: 'license',
      long_description: '',
      images: [],
      type: 'notify',
      name: 'Solo Licenza',
      price: 19.99,
      hero: '/assets/shop/license.webp',
      short_description:
        'Se non hai bisogno di una card fisica, questa è la soluzione per te.',
      options: {
        userCount: true,
        noQuantity: true,
      },
    },
    {
      id: 'google-review',
      long_description: '',
      images: [],
      type: 'reviews',
      name: 'Google',
      price: 19.99,
      hero: '/assets/shop/tier-2.webp',
      short_description:
        'Ottieni rapidamente recensioni positive su Google per il tuo business.',
      options: {},
    },
    {
      id: 'tripadvisor-review',
      long_description: '',
      images: [],
      type: 'reviews',
      name: 'Tripadvisor',
      price: 19.99,
      hero: '/assets/shop/tier-2.webp',
      short_description:
        'Ottieni rapidamente recensioni positive su Tripadvisor per il tuo business.',
      options: {},
    },
    {
      id: 'intagram-review',
      long_description: '',
      images: [],
      type: 'reviews',
      name: 'Instagram',
      price: 19.99,
      hero: '/assets/shop/tier-2.webp',
      short_description:
        'Ottieni rapidamente followers su Instagram per il tuo business.',
      options: {},
    },
  ];

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

  private get _isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

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
