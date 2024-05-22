import { Component } from '@angular/core';
import { INotifyAPDividerItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemPlayerBaseImports,
  providers: AdvancedItemPlayerBaseProviders,
  styleUrl: '../../advanced-profile.styles.scss',
  template: `<div class="notify-divider opacity-25 !my-0"></div>`,
})
export class DividerPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPDividerItem> {}
