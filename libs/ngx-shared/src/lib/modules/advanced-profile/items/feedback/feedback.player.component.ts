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
      (click)="context.emitters.itemClicked(feedback, 'CONTACT_CLICKED')"
      class="btn !flex-nowrap truncate  min-h-1 !h-fit py-2 w-full justify-between disabled:opacity-75"
      [disabled]="feedback.disabled"
      [ngStyle]="{
      'font-size': context.getters.fontSize,
      'background-color':context.getters.textColor,
      'color':textColor,
      'border-color': context.getters.textColor,
      
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

      const rating = hasFeedback?.rating ? hasFeedback?.rating + 1 : undefined;

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

          this.context.emitters.itemClicked(
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
    const pageTextColor = this.context.getters.textColor;

    if (pageTextColor === this.context.getters.textColor) {
      return this.context.services.utils.getContrstingColor(
        pageTextColor || '#000000'
      );
    }

    return this.context.getters.pageSettings?.textColor;
  }
}
