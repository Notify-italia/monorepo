import { Component } from '@angular/core';
import {
  INotifyAPContactItem,
  INotifyAPLinksItem,
  ModifyDeep,
} from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { SvgBoxIcon, SvgboxService } from '../../../../services';
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
          'flex-row  justify-around  flex-nowrap overflow-x-auto notify-scrollbar scrollbar-absolute rounded-lg':
            isHorizontal,
        }"
        [ngStyle]="{
          'background-color': isFilled && isHorizontal?  context.getters.textColor : '',
          'border-color': isFilled && isHorizontal? context.getters.textColor : '',
        }"
      >
        @for (contact of items; track $index) {
        <a
          ontouchstart
          *ngIf="contact.visible"
          (click)="openContact(contact)"
          class="btn !flex-nowrap min-h-1 !h-fit py-2"
          [ngClass]="{
            'w-full justify-between': isVertical,
            'space-x-2 m-1 btn-square ': isHorizontal,
            'btn-outline': isOutlined,
            'btn-ghost': isText,
            'bg-transparent border-none': isFilled && isHorizontal,
          }"
          [ngStyle]="{
          'font-size': context.getters.fontSize,
          'color':textColor,
          'background-color': isFilled && !isHorizontal?  context.getters.textColor : '',
          'border-color': isFilled && !isHorizontal? context.getters.textColor : '',
        }"
        >
          <notify-svg-box-icon
            [icon]="contact.icon"
            [size]="iconSize"
          ></notify-svg-box-icon>
          <span *ngIf="isVertical" class="truncate">{{ contact.caption }}</span>
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
      //se il tipo di sfondo non è filled, il colore del testo è il colore di default
      return this.context.getters.textColor;
    }

    //restituisci nero o bianco in base al contrasto con il colore del testo (usato invece come colore di sfondo)
    return this.context.services.utils.getContrstingColor(
      this.context.getters.textColor || '#000000'
    );
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

  public openContact(
    contact: ModifyDeep<
      INotifyAPContactItem,
      {
        icon: SvgBoxIcon | undefined;
      }
    >
  ) {
    this.context.emitters.itemClicked(contact.icon, 'CONTACT_CLICKED');

    window.open(contact.url, '_blank');
  }
}
