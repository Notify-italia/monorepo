import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  INotifyEcommerceCartItem,
  INotifyEcommerceProduct,
} from '@notify/interfaces';
import {
  EcommerceService,
  ModalBaseComponent,
  PixelService,
} from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [EcommerceService],
  templateUrl: './ecommerce-cart.component.html',
  styleUrl: './ecommerce-cart.component.scss',
})
export class EcommerceCartComponent extends ModalBaseComponent {
  public ecommerce = inject(EcommerceService);
  private _sanitizer = inject(DomSanitizer);
  private _pixel = inject(PixelService);

  public get cartItems() {
    return this.ecommerce.cart.items.map((item) => {
      const productData = this.ecommerce.products.find(
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

  public get cartTotal() {
    return this.cartItems.reduce((acc, item) => acc + item.total, 0);
  }

  public goToCheckout() {
    const cart = {
      ...this.ecommerce.cart,
      items: this.cartItems.map((item) => ({
        ...item,
        description: '',
        product_data: undefined,
      })),
    };
    this._pixel.track('InitiateCheckout', {
      value: this.cartTotal,
      currency: 'EUR',
    });
    this.ecommerce.goToCheckout(cart);
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
