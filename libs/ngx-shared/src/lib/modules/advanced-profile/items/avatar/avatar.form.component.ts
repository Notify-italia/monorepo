import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsService } from '../../../../services';
import { SearchBarComponent } from '../../../../standalones';

import { INotifyAPAvatarItem } from '@notify/interfaces';
import { AdvancedItemFormBaseComponent } from '../../../../constructors/ap-item.form.base.component';
import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  providers: [FormsService, AdvancedProfileItemsService],
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: ` AVATAR WORKS! `,
})
export class AvatarFormComponent extends AdvancedItemFormBaseComponent<INotifyAPAvatarItem> {}
