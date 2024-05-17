import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyAPAvatarItem } from '@notify/interfaces';
import { AdvancedProfileItemPlayerBaseComponent } from '../../../../constructors/ap-item.player.base.component';
import { AvatarComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  styleUrl: '../../advanced-profile.styles.scss',
  template: ` <div class="notify-divider"></div> `,
})
export class DividerPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPAvatarItem> {}
