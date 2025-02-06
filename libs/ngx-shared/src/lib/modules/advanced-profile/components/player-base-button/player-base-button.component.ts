import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  EnumNotifyAPContainerStyles,
  EnumNotifyAPDirections,
  INotifyAPBaseButton,
  UnknownType,
} from '@notify/interfaces';
import { AdvancedProfileItemPlayerBaseComponent } from '../../../../constructors/ap-item.player.base.component';
import { SvgBoxIcon } from '../../../../services';
import { SvgBoxIconComponent } from '../../../../standalones';

@Component({
  selector: 'notify-player-base-button',
  standalone: true,
  imports: [CommonModule, SvgBoxIconComponent],
  styles: `

  `,
  template: `<button
    ontouchstart
    (click)="buttonClicked.emit(button)"
    class="btn !flex-nowrap min-h-1 "
    [ngClass]="{
      'w-full justify-between': isVertical,
      'space-x-2 m-1 aspect-square h-full': isHorizontal,
      'btn-outline': isOutlined,
      'btn-ghost': isText,
      'bg-transparent border-none': isFilled && isHorizontal && !isCircular,
      'rounded-full ': isCircular,
      'border-none': isHorizontal && !isOutlined
    }"
    [ngStyle]="{
  'font-size': context.getters.fontSize,
  'color':computedTextColor,
  'background-color': (isFilled && !isHorizontal) || isFilledCircular ?  context.getters.textColor : '',
  'border-color': isFilled && !isHorizontal? context.getters.textColor : '',
}"
  >
    <notify-svg-box-icon
      [icon]="icon"
      [pixelSize]="iconSize"
    ></notify-svg-box-icon>

    <span *ngIf="isVertical" class="truncate items-center flex h-full ">
      {{ button.caption }}
    </span>
  </button>`,
})
export class PlayerBaseButtonComponent {
  @Input({ required: true }) public direction!: EnumNotifyAPDirections;
  @Input({ required: true }) public style!: EnumNotifyAPContainerStyles;
  @Input({ required: true }) public button!: INotifyAPBaseButton;
  @Input({ required: true }) public icon!: SvgBoxIcon;
  @Input({ required: true })
  public context!: AdvancedProfileItemPlayerBaseComponent<UnknownType>['context'];

  @Output() public buttonClicked = new EventEmitter<INotifyAPBaseButton>();

  public get isVertical(): boolean {
    return this.direction === EnumNotifyAPDirections.Vertical;
  }

  public get isHorizontal(): boolean {
    return this.direction === EnumNotifyAPDirections.Horizontal;
  }

  public get isOutlined(): boolean {
    return [
      EnumNotifyAPContainerStyles.Outlined,
      EnumNotifyAPContainerStyles.CircularOutlined,
    ].includes(this.style);
  }

  public get isText(): boolean {
    return this.style === EnumNotifyAPContainerStyles.Text;
  }

  public get isFilled(): boolean {
    return [
      EnumNotifyAPContainerStyles.Filled,
      EnumNotifyAPContainerStyles.CircularFilled,
    ].includes(this.style);
  }

  public get isCircular(): boolean {
    return [
      EnumNotifyAPContainerStyles.CircularFilled,
      EnumNotifyAPContainerStyles.CircularOutlined,
    ].includes(this.style);
  }

  public get isFilledCircular(): boolean {
    return this.style === EnumNotifyAPContainerStyles.CircularFilled;
  }

  public get iconSize(): number {
    return Number(this.context.getters.fontSize.replace('px', '')) * 1.3;
  }

  public get computedTextColor() {
    if (!this.isFilled) {
      //se il tipo di sfondo non è filled, il colore del testo è il colore di default
      return this.context.getters.textColor;
    }

    //restituisci nero o bianco in base al contrasto con il colore del testo (usato invece come colore di sfondo)
    return this.context.services.utils.getContrastingColor(
      this.context.getters.textColor || '#000000'
    );
  }
}
