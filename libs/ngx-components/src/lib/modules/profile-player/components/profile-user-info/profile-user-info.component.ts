import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { EnumDicebearAvatarStyles } from '@notify/nfc-app-services';
import { AvatarComponent } from '../../../../standalones/avatar/avatar.component';

@Component({
  selector: 'notify-profile-user-info',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './profile-user-info.component.html',
  styleUrls: ['./profile-user-info.component.scss', '../profile.styles.scss'],
})
export class ProfileUserInfoComponent {
  @Input({ required: true }) data?: INotifyProfile;
  @Input({ required: true }) isAgent = false;
  @Input({ required: true }) cssElementsColor = '';

  @Output() public subAvatarClick = new EventEmitter<void>();

  public dicebearAvatarStyles = EnumDicebearAvatarStyles;

  public get hasLongName() {
    return (
      (this.data?.name?.length || 0) + (this.data?.surname?.length || 0) >= 18
    );
  }
}
