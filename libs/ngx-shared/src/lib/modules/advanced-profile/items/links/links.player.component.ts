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
        <button
          (click)="openLink(link)"
          *ngIf="link.visible"
          ontouchstart
          tabindex="0"
          class="btn !flex-nowrap truncate min-h-1 !h-fit py-2 "
          [ngClass]="{
            'w-full justify-between': isVertical,
            'space-x-2 m-1 btn-square ': isHorizontal,
            'btn-outline': isOutlined,
            'btn-ghost': isText,
            'bg-transparent border-none': isFilled && isHorizontal,
          }"
          [ngStyle]="{
          'font-size': context.getters.fontSize,
          'background-color': isFilled && !isHorizontal?  context.getters.textColor : '',
          'border-color': isFilled && !isHorizontal? context.getters.textColor : '',
          'color':textColor,
          
        }"
        >
          <notify-svg-box-icon
            [iconName]="link.icon"
            [pixelSize]="iconSize"
          ></notify-svg-box-icon>
          <span *ngIf="isVertical">{{ link.caption }}</span>
        </button>
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
        url: this.context.services.utils.populateWebProtocol(
          icon?.prefix || 'https://',
          item.url
        ),
      };
    });
  }

  public get iconSize() {
    return Number(this.context.getters.fontSize.replace('px', ''));
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

  public openLink(link: INotifyAPLinkItem) {
    this.context.emitters.itemEvent(link, 'LINK_CLICKED');
    if (this.context.getters.currentItem.openInNotify) {
      this.context.methods.createIframeModal(link.url, link.caption);
      return;
    }

    window.open(link.url, '_blank');
  }
}
