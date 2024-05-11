import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INotifyAdvancedProfileItem } from '@notify/interfaces';
import { AvailableItemsComponent } from '../../components/available-items/available-items.component';
import { HierarchyComponent } from '../../components/hierarchy/hierarchy.component';

@Component({
  selector: 'notify-left-panel',
  standalone: true,
  imports: [CommonModule, AvailableItemsComponent, HierarchyComponent],
  templateUrl: './left-panel.component.html',
  styleUrls: [
    '../../advanced-profile.styles.scss',
    './left-panel.component.scss',
  ],
})
export class LeftPanelComponent {
  @Input({ required: true }) hierarchy!: INotifyAdvancedProfileItem[];

  @Output() addItem = new EventEmitter<FormGroup>();
}
