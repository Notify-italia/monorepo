import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'notify-swipe-available',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipe-available.component.html',
  styleUrls: ['./swipe-available.component.scss'],
})
export class SwipeAvailableComponent {
  @Input({ required: true }) public title!: string;
  @Input({ required: true }) public subtitle!: string;
}
