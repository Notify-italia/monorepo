import { Component, inject } from '@angular/core';
import { INotifyAPFeedbackItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { FeedbackService } from '../../../../services';
import { FEEDBACK_ICON_SET } from './feedback.iconset';

@Component({
  standalone: true,
  imports: AdvancedItemPlayerBaseImports,
  providers: [...AdvancedItemPlayerBaseProviders, FeedbackService],
  styleUrl: '../../advanced-profile.styles.scss',
  template: ` <div
    *ngIf="this.context.getters.container as container"
    [class]="container.class"
    [ngStyle]="container.ngStyle"
    [ngClass]="container.ngClass"
  >
    @if (button; as feedback) {
    <button
      (click)="context.emitters.itemEvent(feedback, 'CONTACT_CLICKED')"
      class="btn !flex-nowrap truncate  min-h-1 !h-fit py-2 w-full justify-between disabled:opacity-75"
      [disabled]="feedback.disabled"
      [ngClass]="{

            'btn-outline': isOutlined,
            'btn-ghost': isText,
          }"
      [ngStyle]="{
          'font-size': context.getters.fontSize,
          'background-color': isFilled ?  context.getters.textColor : '',
          'border-color': isFilled ? context.getters.textColor : '',
          'color':textColor,
          
        }"
      (click)="feedback.onClick()"
      target="_blank"
    >
      <notify-svg-box-icon
        [icon]="icon"
        [size]="iconSize"
      ></notify-svg-box-icon>
      <span>{{ feedback.caption }}</span>
    </button>

    }
  </div>`,
})
export class FeedbackPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPFeedbackItem> {
  private _feedbackService = inject(FeedbackService);
  private _iconSet = FEEDBACK_ICON_SET;

  public get icon() {
    return this.context.services.svgBox.getIcon(
      this.button.icon,
      this._iconSet
    );
  }

  public get button() {
    if (this.context.getters.isRequired) {
      const hasFeedback = this._feedbackService.getFeedbackFromLocalStorage(
        this.context.getters.profile.owner,
        //environment.ts => feedbackKey
        this.context.getters.environment['feedbackKey'] as string
      );

      const rating = hasFeedback?.rating ? hasFeedback?.rating : undefined;

      return {
        caption: hasFeedback
          ? `Valutato ${rating} stell${rating === 1 ? 'a' : 'e'}`
          : 'Lascia un feedback',
        disabled: hasFeedback,
        icon: 'generic',
        onClick: () => {
          if (hasFeedback) {
            return;
          }

          this.context.emitters.itemEvent(
            this.context.getters.profile,
            'SHOW_FEEDBACK_FORM'
          );
        },
      };
    }

    return {
      ...this.context.getters.currentItem,
      onClick: () =>
        window.open(this.context.getters.currentItem.url, '_blank'),
    };
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
    return this.context.services.utils.getContrastingColor(
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
}
