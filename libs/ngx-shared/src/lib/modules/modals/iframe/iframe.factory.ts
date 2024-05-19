import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors';
import { IFrameComponent } from './iframe.component';

@Injectable()
export class iframeFactory extends BaseFactory {
  public create(config: { url: string; title: string }) {
    return this._createComponent(IFrameComponent, {
      ...config,
    });
  }
}
