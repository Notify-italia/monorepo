import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  INotifyEcommerceCartItem,
  INotifyEcommerceProduct,
} from '@notify/interfaces';
import { EcommerceService, ModalBaseComponent } from '@notify/ngx-shared';

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
    this.ecommerce.goToCheckout(cart);
  }

  private _createItemDescription(
    item: INotifyEcommerceCartItem,
    productData?: INotifyEcommerceProduct
  ) {
    const labels: { [key: string]: string } = {};

    if (item.options.color) {
      labels['color'] = `${item.options.color}`;
    }

    if (item.options.usersInfo) {
      labels['usersInfo'] = `Anagrafiche: <ul>
      ${item.options.usersInfo.map((info) => `<li>${info}</li>`).join('')}
       </ul>`;
    }

    // if (item.options.userCount) {
    //   labels['userCount'] = `${item.options.userCount} Utenti`;
    // }

    if (item.options.logo) {
      labels['logo'] = `Logo: ${item.options.logo.filename}`;
    }

    if (productData?.options.includesLicense) {
      labels['license'] = '<br/> Slot utente incluso';
    }

    return this._sanitizer.bypassSecurityTrustHtml(
      Object.keys(labels)
        .map((key) => labels[key].toUpperCase())
        .join('<br>')
    );
  }
}
