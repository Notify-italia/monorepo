import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvailableItemsComponent } from '../components/available-items/available-items.component';
import { HierarchyComponent } from '../components/hierarchy/hierarchy.component';

@Component({
  selector: 'notify-left-menu',
  standalone: true,
  imports: [CommonModule, AvailableItemsComponent, HierarchyComponent],
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss', '../advanced-profile.styles.scss'],
})
export class LeftMenuComponent {}
