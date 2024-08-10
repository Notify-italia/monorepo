import { Injectable, inject } from '@angular/core';
import { INotifyEcommerceCart, UnknownType } from '@notify/interfaces';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from './http.service';

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
    users?: boolean;
    colors?: {
      label: string;
      id: string;
      thumbnail: string;
      image: string;
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
      long_description: `Le nostre cards Basic PVC sono perfette per chi vuole entrare nel mondo Notify con un prodotto di qualità a un prezzo accessibile.
        La card Basic PVC è disponibile in diversi stili e colori, con la possibilità di inserire il QR Code del proprio profilo direttamente sulla card.
        `,
      options: {
        users: false,
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
            id: 'hexagon-azzurro',
            thumbnail: '/assets/cards/esagoni/river_thumb.webp',
            image: '/assets/shop/Tessere shop - Hexagon Pattern Azzurro.webp',
          },
          {
            label: 'Hexagon Pattern Fucsia',
            id: 'hexagon-fucsia',
            thumbnail: '/assets/cards/esagoni/neon_thumb.webp',
            image: '/assets/shop/Tessere shop - Hexagon Pattern Fucsia.webp',
          },
          {
            label: 'Hexagon Pattern Giallo',
            id: 'hexagon-giallo',
            thumbnail: '/assets/cards/esagoni/banana_thumb.webp',
            image: '/assets/shop/Tessere shop - Hexagon Pattern Giallo.webp',
          },
          {
            label: 'Hive Pattern Fucsia',
            id: 'hive-fucsia',
            thumbnail: '/assets/cards/rombi/neon_thumb.webp',
            image: '/assets/shop/Tessere shop - Hive Pattern Fucsia.webp',
          },
          {
            label: 'Hive Pattern Azzurro',
            id: 'hive-azzurro',
            thumbnail: '/assets/cards/rombi/river_thumb.webp',
            image: '/assets/shop/Tessere shop - Hive Pattern Azzurro.webp',
          },
          {
            label: 'Hive Pattern Giallo',
            id: 'hive-giallo',
            thumbnail: '/assets/cards/rombi/banana_thumb.webp',
            image: '/assets/shop/Tessere shop - Hive Pattern Giallo.webp',
          },
        ],
      },
    },
    {
      id: 'tier-2',
      long_description: '',
      type: 'notify',
      name: 'Personal PVC',
      price: 34.99,
      hero: '/assets/shop/tier-2.webp',
      images: [
        '/assets/shop/Tessere shop - Tier2 - Nero.webp',
        '/assets/shop/Tessere shop - Tier2 - Bianco.webp',
      ],
      short_description:
        'Una card in PVC con logo e nome personalizzati, disponibile light e dark.',
      options: {
        users: true,
        qrCode: true,
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
        'Una card in PVC totalmente personalizzabile, ideale per realtà che valorizzano il proprio brand.',
      options: {
        users: true,
        qrCode: true,
      },
    },
    {
      id: 'license',
      long_description: '',
      images: [],
      type: 'notify',
      name: 'Digital',
      price: 19.99,
      hero: '/assets/shop/license.webp',
      short_description:
        'Se non hai bisogno di una card fisica, questa è la soluzione per te.',
      options: {
        users: true,
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
