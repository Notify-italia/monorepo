import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'notify-no-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-items.component.html',
  styleUrl: './no-items.component.scss',
})
export class NoItemsComponent {
  @Input() title = 'No items to display';
  @Input() subtitle = 'Add a new item to get started';
}
