import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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

  public placeholderAvatarProvider =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
}
