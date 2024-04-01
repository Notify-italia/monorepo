import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../../constructors/base.factory';
import { ShareFileModalComponent } from './share-file-modal.component';

@Injectable()
export class ShareFileFactory extends BaseFactory {
  public create() {
    return this._createComponent(ShareFileModalComponent);
  }
}
