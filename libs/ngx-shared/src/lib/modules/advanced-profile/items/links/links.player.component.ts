import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { INotifyAPLinksItem } from '@notify/interfaces';
import { AdvancedProfileItemPlayerBaseComponent } from '../../../../constructors/ap-item.player.base.component';
import { SvgboxService } from '../../../../services';
import { AvatarComponent, SvgBoxIconComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [CommonModule, AvatarComponent, SvgBoxIconComponent],
  providers: [SvgboxService],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
    >
      <div
        class="flex items-center w-full"
        [ngClass]="{
          'flex-col space-y-4': isVertical,
          'flex-row  justify-evenly flex-wrap ': isHorizontal
        }"
      >
        @for (link of items; track $index) {
        <a
          *ngIf="link.visible"
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
          'border-color': isFilled ? context.getters.textColor : '',
          'color':textColor,
          
        }"
          [href]="link.url"
          target="_blank"
        >
          <notify-svg-box-icon
            [iconName]="link.icon"
            [size]="iconSize"
          ></notify-svg-box-icon>
          <span *ngIf="isVertical">{{ link.caption }}</span>
        </a>
        }
      </div>
    </div>
  `,
})
export class LinksPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPLinksItem> {
  private _svgBoxService = inject(SvgboxService);

  public get items() {
    return this.currentItem.items.map((item) => {
      const icon = this._svgBoxService.getIcon(item.icon);

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
