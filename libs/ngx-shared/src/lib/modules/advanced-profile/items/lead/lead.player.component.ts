import { Component } from '@angular/core';
import { INoitfyAPLeadItem } from '@notify/interfaces';
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
  template: ``,
})
export class LeadPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INoitfyAPLeadItem> {}
