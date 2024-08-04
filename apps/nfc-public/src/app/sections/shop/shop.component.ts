import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EcommerceService, SSRBaseComponent } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'notify-shop',
  styleUrls: ['./shop.component.scss'],
  templateUrl: './shop.component.html',
})
export class ShopComponent extends SSRBaseComponent {
  public ecommerce = inject(EcommerceService);
}
