import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcommerceService, PixelService } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [EcommerceService],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent {
  private ecommerceService = inject(EcommerceService);
  private _pixel = inject(PixelService);

  constructor() {
    this._pixel.track('Purchase', {
      value: this.ecommerceService.cartTotal,
      currency: 'EUR',
      content_ids: this.ecommerceService.cart.items.map((item) => item.product),
      content_type: 'product',
      num_items: this.ecommerceService.cart.items.length,
    });
    afterNextRender(() => {
      this.ecommerceService.clearCart();
    });
  }
}
