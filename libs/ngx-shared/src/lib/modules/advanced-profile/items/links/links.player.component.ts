import { Component } from '@angular/core';
import { INotifyAPLinkItem, INotifyAPLinksItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { SvgboxService } from '../../../../services';
import { SvgBoxIconComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [...AdvancedItemPlayerBaseImports, SvgBoxIconComponent],
  providers: [...AdvancedItemPlayerBaseProviders, SvgboxService],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      <div
        tabindex="0"
        class="flex items-center w-full"
        [ngClass]="{
          'flex-col space-y-4': isVertical,
          'flex-row  justify-around  flex-nowrap overflow-x-auto notify-scrollbar scrollbar-absolute rounded-lg':
            isHorizontal
        }"
        [ngStyle]="{
          'background-color': isFilled && isHorizontal?  context.getters.textColor : '',
          'border-color': isFilled && isHorizontal? context.getters.textColor : '',
        }"
      >
        @for (link of items; track $index) {
        <notify-player-base-button
          *ngIf="link.visible"
          [ngClass]="{
            'w-full': isVertical,
          }"
          [direction]="currentItem.direction"
          [style]="currentItem.style"
          [button]="link"
          [context]="context"
          [icon]="link.foundIcon"
          (buttonClicked)="openLink($event)"
        ></notify-player-base-button>
        }
      </div>
    </div>
  `,
})
export class LinksPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPLinksItem> {
  public get items() {
    return this.currentItem.items.map((item) => {
      const icon = this.context.services.svgBox.getIcon(item.icon);

      return {
        ...item,
        foundIcon: icon,
        url: this.context.services.utils.populateWebProtocol(
          icon?.prefix || 'https://',
          item.url
        ),
      };
    });
  }

  public get isFilled() {
    return this.currentItem.style === this.context.statics.buttonStyles.Filled;
  }

  public get isHorizontal() {
    return (
      this.currentItem.direction === this.context.statics.directions.Horizontal
    );
  }

  public get isVertical() {
    return (
      this.currentItem.direction === this.context.statics.directions.Vertical
    );
  }

  public openLink(link: INotifyAPLinkItem) {
    this.context.emitters.itemEvent(link, 'LINK_CLICKED');
    if (this.context.getters.currentItem.openInNotify) {
      this.context.methods.createIframeModal(link.url, link.caption);
      return;
    }

    window.open(link.url, '_blank');
  }
}
