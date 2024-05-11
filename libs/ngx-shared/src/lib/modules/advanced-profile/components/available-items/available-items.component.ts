import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  EnumNotifyAdvancedProfileItems,
  INotifyAPAvailableItem,
} from '@notify/interfaces';
import { of } from 'rxjs';
import { FormsService } from '../../../../services';
import { SearchBarComponent } from '../../../../standalones';

import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  selector: 'notify-available-items',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  providers: [FormsService, AdvancedProfileItemsService],
  templateUrl: './available-items.component.html',
  styleUrls: [
    './available-items.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class AvailableItemsComponent {
  private _apItemSerivce = inject(AdvancedProfileItemsService);

  @Output() addItem = new EventEmitter<FormGroup>();

  public availableItems$ = of(this._apItemSerivce.getAvailableItems());
  public availableItems: INotifyAPAvailableItem[] = [];

  public emitAddItem(item: EnumNotifyAdvancedProfileItems) {
    this.addItem.emit(this._apItemSerivce.generateFormGroup(item));
  }
}
