import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import { IFrameComponent, IFrameModalNavbarStyle } from './iframe.component';

@Injectable()
export class iframeFactory extends BaseFactory {
  public create(config: {
    url: string;
    title: string;
    navbarStyle: IFrameModalNavbarStyle;
  }) {
    return this._createComponent(IFrameComponent, {
      ...config,
    });
  }
}
