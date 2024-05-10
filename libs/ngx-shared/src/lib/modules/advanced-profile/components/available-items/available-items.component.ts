import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  INotifyAPAvailableItem,
  NOTIFY_AVAILABLE_ITEMS,
} from '@notify/interfaces';
import { of } from 'rxjs';
import { SearchBarComponent } from '../../../../standalones';

@Component({
  selector: 'notify-available-items',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './available-items.component.html',
  styleUrls: [
    './available-items.component.scss',
    '../../advanced-profile.styles.scss',
  ],
})
export class AvailableItemsComponent {
  @Output() addItem = new EventEmitter<string>();

  public availableItems$ = of(NOTIFY_AVAILABLE_ITEMS);

  public availableItems: INotifyAPAvailableItem[] = [];
}
