import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  EcommerceService,
  INotifyEcommerceProduct,
  SSRBaseComponent,
} from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'notify-shop',
  styleUrls: ['./shop.component.scss'],
  templateUrl: './shop.component.html',
})
export class ShopComponent extends SSRBaseComponent {
  @Output() handleItemClicked = new EventEmitter<INotifyEcommerceProduct>();

  public ecommerce = inject(EcommerceService);
}
