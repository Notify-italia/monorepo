import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class LeftPanelComponent {}
