import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'notify-device-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-icon.component.html',
  styleUrl: './device-icon.component.scss',
})
export class DeviceIconComponent {
  @Input({ required: true }) deviceType!: string;
}
