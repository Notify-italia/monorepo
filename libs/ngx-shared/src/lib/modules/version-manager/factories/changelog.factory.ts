import { Injectable } from '@angular/core';
import { BaseFactory } from '../../../constructors/base.factory';
import { ChangelogComponent } from '../components/changelog/changelog.component';
import { INotifyVersionInfo } from '../components/version-label/version-label.component';

@Injectable()
export class ChangelogFactory extends BaseFactory {
  public create(versionInfo: INotifyVersionInfo) {
    return this._createComponent(ChangelogComponent, {
      versionInfo,
    });
  }
}
