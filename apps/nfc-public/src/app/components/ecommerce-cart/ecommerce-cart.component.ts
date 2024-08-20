import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyEcommerceCartItem } from '@notify/interfaces';
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
        product_data: productData,
        description: this._createItemDescription(item),
      };
    });
  }

  public get cartTotal() {
    return this.cartItems.reduce((acc, item) => acc + item.total, 0);
  }

  private _createItemDescription(item: INotifyEcommerceCartItem) {
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

    return this._sanitizer.bypassSecurityTrustHtml(
      Object.keys(labels)
        .map((key) => labels[key].toUpperCase())
        .join('<br>')
    );
  }
}
