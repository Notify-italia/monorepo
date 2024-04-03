import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISocketUserInfo } from '@notify/interfaces';
import { DeviceIconComponent } from '../device-icon/device-icon.component';

@Component({
  selector: 'notify-device-card',
  standalone: true,
  imports: [CommonModule, DeviceIconComponent],
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.scss',
})
export class DeviceCardComponent {
  @Input({ required: true }) user!: ISocketUserInfo;

  @Output() clicked = new EventEmitter();
}
