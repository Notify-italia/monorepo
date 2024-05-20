import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyAPDividerItem } from '@notify/interfaces';
import { AdvancedProfileItemPlayerBaseComponent } from '../../../../constructors/ap-item.player.base.component';
import { AvatarComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `<div class="notify-divider opacity-25 !my-0"></div>`,
})
export class DividerPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPDividerItem> {}
