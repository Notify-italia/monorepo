import { Injectable } from '@angular/core';

import { INotifyEcommerceProduct } from '@notify/interfaces';
import { BaseFactory } from '@notify/ngx-shared';
import { EcommerceItemDetailComponent } from './ecommerce-item-detail.component';

@Injectable()
export class EcommerceItemDetailFactory extends BaseFactory {
  public create(config: {
    item: INotifyEcommerceProduct;
    submitLabel?: {
      mobile: string;
      desktop: string;
    };
  }) {
    return this._createComponent(EcommerceItemDetailComponent, {
      ...config,
    });
  }
}
