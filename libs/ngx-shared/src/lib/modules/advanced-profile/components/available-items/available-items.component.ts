import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  INotifyAPAvailableItem,
  NotifyAdvancedProfileItemTypes,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableItemsComponent {
  private _apItemSerivce = inject(AdvancedProfileItemsService);

  @Output() addItem = new EventEmitter<FormGroup>();

  public availableItems$ = of(
    this._apItemSerivce
      .getAvailableItems()
      .sort((a, b) => a.label.localeCompare(b.label))
  );
  public availableItems: INotifyAPAvailableItem[] = [];

  public emitAddItem(item: NotifyAdvancedProfileItemTypes) {
    this.addItem.emit(this._apItemSerivce.generateFormGroup(item));
  }

  public isTopRow(index: number): boolean {
    return index / 4 < 1;
  }

  public isWallColumn(index: number) {
    const isWallColumn = index % 4 === 0 || (index + 1) % 4 === 0;

    return {
      result: isWallColumn,
      side: index % 4 === 0 ? 'left' : 'right',
    };
  }
}
