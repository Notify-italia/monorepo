import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyAPPhotoItem } from '@notify/interfaces';
import { AdvancedProfileItemPlayerBaseComponent } from '../../../../constructors/ap-item.player.base.component';
import { AvatarComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <img
      (click)="handleClick()"
      [src]="context.getters.currentItem.imgSrc"
      class="w-full rounded-lg  object-cover pointer-events-none"
      [ngClass]="{
        'cursor-pointer hover:scale-95 smooth pointer-events-auto': context.getters.currentItem.showCompanyOnClick && ['none', 'sm', 'md'].includes(context.services.utils.currentTailwindMediaQuery()),
      }"
    />
  `,
})
export class PhotoPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPPhotoItem> {
  public handleClick() {
    if (!this.context.getters.currentItem.showCompanyOnClick) {
      return;
    }
    this.context.emitters.itemClicked(null, 'SHOW_COMPANY_PROFILE');
  }
}
