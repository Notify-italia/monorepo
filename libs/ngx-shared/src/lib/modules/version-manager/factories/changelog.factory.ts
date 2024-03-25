import { Injectable, ViewContainerRef } from '@angular/core';
import { ChangelogComponent } from '../components/changelog/changelog.component';
import { INotifyVersionInfo } from '../components/version-label/version-label.component';

@Injectable()
export class ChangelogFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create(versionInfo: INotifyVersionInfo) {
    const ref = this.vcr.createComponent(ChangelogComponent);

    ref.setInput('cf', ref);
    ref.setInput('versionInfo', versionInfo);

    return ref;
  }
}
