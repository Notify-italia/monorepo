import { Component } from '@angular/core';
import { INotifyAPLinksItem } from '@notify/interfaces';
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
          'flex-row  justify-around  flex-nowrap overflow-x-auto notify-scrollbar scrollbar-absolute':
            isHorizontal
        }"
      >
        @for (contact of items; track $index) {
        <a
          *ngIf="contact.visible"
          (click)="context.emitters.itemClicked(contact, 'CONTACT_CLICKED')"
          class="btn !flex-nowrap truncate  min-h-1 !h-fit py-2"
          [ngClass]="{
            'w-full justify-between': isVertical,
            'space-x-2 m-1 btn-square ': isHorizontal,
            'btn-outline': isOutlined,
            'btn-ghost': isText,
            
          }"
          [ngStyle]="{
          'font-size': context.getters.fontSize,
          'background-color': isFilled ?  context.getters.textColor : '',
          'color':textColor,
          'border-color': isFilled ? context.getters.textColor : '',
          
        }"
          [href]="contact.url"
          target="_blank"
        >
          <notify-svg-box-icon
            [icon]="contact.icon"
            [size]="iconSize"
          ></notify-svg-box-icon>
          <span *ngIf="isVertical">{{ contact.caption }}</span>
        </a>
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
        icon,
        url: this.context.services.utils.populateWebProtocol(
          icon?.prefix || 'https://',
          item.url
        ),
      };
    });
  }

  public get iconSize() {
    const fontSize = Number(this.context.getters.fontSize.replace('px', ''));
    const result = Math.ceil(fontSize / 4);

    if (result % 2 !== 0) {
      return result + 1;
    }

    return result;
  }

  public get textColor() {
    if (!this.isFilled) {
      return this.context.getters.textColor;
    }

    const pageTextColor = this.context.getters.pageSettings?.textColor;

    if (pageTextColor === this.context.getters.textColor) {
      return this.context.services.utils.getContrstingColor(
        pageTextColor || '#000000'
      );
    }

    return this.context.getters.pageSettings?.textColor;
  }

  public get isFilled() {
    return this.currentItem.style === this.context.statics.buttonStyles.Filled;
  }

  public get isOutlined() {
    return (
      this.currentItem.style === this.context.statics.buttonStyles.Outlined
    );
  }

  public get isText() {
    return this.currentItem.style === this.context.statics.buttonStyles.Text;
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
}
