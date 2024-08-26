import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [EcommerceService],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent {
  private ecommerceService = inject(EcommerceService);

  constructor() {
    this.ecommerceService.clearCart();
  }
}
