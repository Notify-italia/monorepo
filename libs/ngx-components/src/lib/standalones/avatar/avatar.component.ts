import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DaisyUIAvatarMasks } from '@notify/interfaces';

interface AvatarConfig {
  src: string | null;
  size: string;
  mask: DaisyUIAvatarMasks;
}

@Component({
  selector: 'notify-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() avatarConfig: AvatarConfig = {
    src: null,
    size: 'w-10 h-10',
    mask: 'circle',
  };
  @Input() subAvatarConfig?: AvatarConfig = {
    src: null,
    size: 'w-6 h-6',
    mask: 'circle',
  };

  @Output() subAvatarClick = new EventEmitter<void>();

  public placeholderAvatarProvider =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
}
