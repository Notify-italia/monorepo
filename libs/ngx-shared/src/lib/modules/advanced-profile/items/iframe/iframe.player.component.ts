import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyAPIFrameItem } from '@notify/interfaces';
import { AdvancedProfileItemPlayerBaseComponent } from '../../../../constructors/ap-item.player.base.component';
import { CachedSrcDirective } from '../../../../directives';
import { AvatarComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [CommonModule, AvatarComponent, CachedSrcDirective],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <a [href]="currentUrl" target="_blank">
      <iframe
        [cachedSrc]="currentUrl"
        frameborder="0"
        class="!rounded-lg w-full h-full pointer-events-none "
      ></iframe>
    </a>
  `,
})
export class IFramePlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPIFrameItem> {
  public get currentUrl() {
    const url = this.context.getters.currentItem.url;

    const normalized = this.context.services.utils.populateWebProtocol(
      'https://',
      url
    );

    return normalized;
  }

  public navigateToUrl() {
    const url = this.context.getters.currentItem.url;

    this.context.services.utils.navigateToUrl(url);
  }
}
