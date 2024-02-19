import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DaisyUIAvatarMasks } from '@notify/interfaces';
import {
  EnumDicebearAvatarStyles,
  UtilsService,
} from '@notify/nfc-app-services';

interface AvatarConfig {
  src: string | null;
  size: string;
  mask: DaisyUIAvatarMasks;
  placeholderSeed: string;
  backgroundColor?: string;
  placeholderStyle?: EnumDicebearAvatarStyles;
}

@Component({
  selector: 'notify-avatar',
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() avatarConfig: AvatarConfig = {
    src: null,
    size: 'w-10 h-10',
    mask: 'circle',
    placeholderSeed: 'avatar',
  };
  @Input() subAvatarConfig?: AvatarConfig = {
    src: null,
    size: 'w-6 h-6',
    mask: 'circle',
    placeholderSeed: 'sub-avatar',
  };

  @Output() subAvatarClick = new EventEmitter<void>();

  public get placeholderAvatar() {
    return this._utils.diceBearAvatar({
      style:
        this.avatarConfig.placeholderStyle || EnumDicebearAvatarStyles.BigSmile,
      seed: this.avatarConfig.placeholderSeed || '',
    });
  }

  constructor(private _utils: UtilsService) {}
}
