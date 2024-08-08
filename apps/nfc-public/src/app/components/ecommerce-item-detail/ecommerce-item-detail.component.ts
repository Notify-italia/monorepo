import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  baseModalComponentProviders,
  INotifyEcommerceProduct,
  ModalBaseComponent,
} from '@notify/ngx-shared';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [baseModalComponentProviders],
  templateUrl: './ecommerce-item-detail.component.html',
  styleUrl: './ecommerce-item-detail.component.scss',
})
export class EcommerceItemDetailComponent extends ModalBaseComponent {
  @Input() item!: INotifyEcommerceProduct;

  public selectedImage = 0;

  public shareProduct() {
    console.log('Sharing product...');

    if (!navigator.share) {
      navigator.clipboard.writeText(
        `${environment.shopUrl}?product=${this.item.id}`
      );
      alert('Link copiato negli appunti');
      return;
    }

    navigator.share({
      title: this.item.name,
      text: this.item.short_description,
      url: `${environment.shopUrl}?product=${this.item.id}`,
    });
  }
}
