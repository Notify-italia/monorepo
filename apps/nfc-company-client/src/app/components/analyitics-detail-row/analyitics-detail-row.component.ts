import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyAPAvatarItem } from '@notify/interfaces';
import { AvatarComponent, INotifyAvatarConfig } from '@notify/ngx-shared';
import { hidratedAgent } from '../../pages/analytics-detail/analytics-detail.component';

@Component({
  selector: 'notify-analyitics-detail-user-row',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './analyitics-detail-row.component.html',
  styleUrl: './analyitics-detail-row.component.scss',
})
export class AnalyiticsDetailRowComponent {
  @Input() public item?: hidratedAgent;
  @Input() public selected = false;
  @Input() public hasSelected = false;

  @Output() public selectedItem = new EventEmitter<hidratedAgent>();

  public get avatarData(): INotifyAvatarConfig & { name: string } {
    const advancedProfile = this.item?.profile?.advancedProfile;

    if (!advancedProfile?.enabled) {
      return {
        src: this.item?.profile?.avatar || '',
        mask: this.item?.profile?.config?.avatarMask || '',
        size: '14',
        placeholderSeed: this.item?.profile?._id || '',
        name: `${this.item?.profile?.name || ''} ${
          this.item?.profile?.surname || ''
        }`,
      };
    }

    const avatar = advancedProfile.items.find(
      (item) => item._id === advancedProfile.requiredItems.avatar
    ) as INotifyAPAvatarItem;

    return {
      src: avatar?.imgSrc || '',
      mask: avatar.imgMask || '',
      size: '14',
      placeholderSeed: this.item?.profile?._id || '',
      name: `${avatar.label || ''}`,
    };
  }
}
