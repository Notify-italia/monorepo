import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import {
  AdsBannerComponent,
  INotifyAdsBannerInteractions,
} from './ads-banner.component';

@Injectable()
export class AdsBannerFactory extends BaseFactory {
  public create<D>(config: {
    desktopBanner: string;
    mobileBanner: string;
    interactions: INotifyAdsBannerInteractions<D>;
  }) {
    return this._createComponent(AdsBannerComponent, config);
  }
}
