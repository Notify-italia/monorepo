import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    return this.ecommerce.populateCart();
  }

  public get cartTotal() {
    return this.cartItems.reduce((acc, item) => acc + item.total, 0);
  }

  public goToCheckout() {
    this._pixel.track('InitiateCheckout', {
      value: this.cartTotal,
      currency: 'EUR',
    });
    this.ecommerce.goToCheckout();
  }
}
