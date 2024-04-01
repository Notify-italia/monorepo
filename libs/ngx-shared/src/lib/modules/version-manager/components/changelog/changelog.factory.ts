import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../../constructors/base.factory';
import { INotifyVersionInfo } from '../version-label/version-label.component';
import { ChangelogComponent } from './changelog.component';

@Injectable()
export class ChangelogFactory extends BaseFactory {
  public create(versionInfo: INotifyVersionInfo) {
    return this._createComponent(ChangelogComponent, {
      versionInfo,
    });
  }
}
