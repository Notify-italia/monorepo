import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
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
export class AvatarComponent implements OnChanges {
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

  public scrambleCache = `?c=${Date.now()}`;
  public get cleanedConfigs() {
    const isMainUri =
      this.avatarConfig.src && this.avatarConfig.src.includes('http');
    const isSubUri =
      this.subAvatarConfig?.src && this.subAvatarConfig.src.includes('http');

    const main = {
      src: isMainUri
        ? this.avatarConfig.src + this.scrambleCache
        : this.avatarConfig.src,
      size: this.avatarConfig.size,
      mask: this.avatarConfig.mask,
      placeholderSeed: this.avatarConfig.placeholderSeed,
      backgroundColor: this.avatarConfig.backgroundColor,
      placeholderStyle: this.avatarConfig.placeholderStyle,
    };

    const sub = {
      src: isSubUri
        ? this.subAvatarConfig?.src + this.scrambleCache
        : this.subAvatarConfig?.src,
      size: this.subAvatarConfig?.size,
      mask: this.subAvatarConfig?.mask,
      placeholderSeed: this.subAvatarConfig?.placeholderSeed,
      backgroundColor: this.avatarConfig.backgroundColor,
      placeholderStyle: this.subAvatarConfig?.placeholderStyle,
    };

    return { main, sub };
  }

  public get placeholderAvatar() {
    return this._utils.diceBearAvatar({
      style:
        this.avatarConfig.placeholderStyle || EnumDicebearAvatarStyles.BigSmile,
      seed: this.avatarConfig.placeholderSeed || '',
    });
  }

  constructor(private _utils: UtilsService) {}

  ngOnChanges() {
    this.scrambleCache = `?c=${Date.now()}`;
  }
}
