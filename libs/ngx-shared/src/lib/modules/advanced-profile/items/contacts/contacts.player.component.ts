import { Component } from '@angular/core';
import { INotifyAPContactItem, INotifyAPLinksItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { SvgboxService } from '../../../../services';
import { SvgBoxIconComponent } from '../../../../standalones';
import { CONTACTS_ICON_SET } from './contacts.iconset';

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
        class="flex items-center w-full"
        [ngClass]="{
          'flex-col space-y-4': isVertical,
          'flex-row justify-around flex-nowrap overflow-x-auto notify-scrollbar scrollbar-absolute rounded-lg':
            isHorizontal,
        }"
        [ngStyle]="{
          'background-color': isFilled && isHorizontal?  context.getters.textColor : '',
          'border-color': isFilled && isHorizontal? context.getters.textColor : '',
        }"
      >
        @for (contact of items; track $index) {
        <notify-player-base-button
          *ngIf="contact.visible"
          [ngClass]="{
            'w-full': isVertical,
          }"
          [direction]="currentItem.direction"
          [style]="currentItem.style"
          [button]="contact"
          [context]="context"
          [icon]="contact.foundIcon"
          (buttonClicked)="openContact($event)"
        ></notify-player-base-button>
        }
      </div>
    </div>
  `,
})
export class ContactsPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPLinksItem> {
  public iconset = CONTACTS_ICON_SET;

  public get items() {
    return this.currentItem.items.map((item) => {
      const icon = this.context.services.svgBox.getIcon(
        item.icon,
        this.iconset
      );

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

  public openContact(contact: INotifyAPContactItem) {
    this.context.emitters.itemEvent(contact.icon, 'CONTACT_CLICKED');

    window.open(contact.url, '_blank');
  }
}
