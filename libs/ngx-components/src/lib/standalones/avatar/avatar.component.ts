import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type IAvatarMasks =
  | 'circle'
  | 'square'
  | 'squircle'
  | 'heart'
  | 'hexagon'
  | 'hexagon-2'
  | 'decagon'
  | 'pentagon'
  | 'diamond'
  | 'parallelogram'
  | 'parallelogram-2'
  | 'parallelogram-3'
  | 'parallelogram-4'
  | 'star'
  | 'start-2'
  | 'triangle'
  | 'triangle-2'
  | 'triangle-3'
  | 'triangle-4'
  | 'half-1'
  | 'half-2';

@Component({
  selector: 'notify-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() src?: string | null;
  @Input({ required: true }) size?: string;
  @Input() public mask: IAvatarMasks = 'circle';

  public placeholderAvatarProvider =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
}
