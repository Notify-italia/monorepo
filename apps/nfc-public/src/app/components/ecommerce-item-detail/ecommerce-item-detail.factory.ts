import { Injectable } from '@angular/core';

import { BaseFactory, INotifyEcommerceProduct } from '@notify/ngx-shared';
import { EcommerceItemDetailComponent } from './ecommerce-item-detail.component';

@Injectable()
export class EcommerceItemDetailFactory extends BaseFactory {
  public create(config: { item: INotifyEcommerceProduct }) {
    return this._createComponent(EcommerceItemDetailComponent, {
      ...config,
    });
  }
}
