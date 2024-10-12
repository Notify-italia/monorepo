import { Injectable } from '@angular/core';

import { BaseFactory } from '@notify/ngx-shared';
import { EcommerceCartComponent } from './ecommerce-cart.component';

@Injectable()
export class EcommerceCartFactory extends BaseFactory {
  public create() {
    return this._createComponent(EcommerceCartComponent);
  }
}
