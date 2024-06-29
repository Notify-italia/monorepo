import { Component } from '@angular/core';

import { INoitfyAPLeadItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: ``,
})
export class LeadFormComponent extends AdvancedProfileItemFormBaseComponent<INoitfyAPLeadItem> {}
