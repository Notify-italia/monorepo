import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { EnumNotifyAPCorners, INotifyAPAvatarItem } from '@notify/interfaces';
import { EnumDicebearAvatarStyles, UtilsService } from '../../services';

export interface INotifyAvatarConfig {
  src: string | null;
  size: string;
  mask: INotifyAPAvatarItem['imgMask'];
  placeholderSeed: string;
  backgroundColor?: string;
  placeholderStyle?: EnumDicebearAvatarStyles;
  placement?: EnumNotifyAPCorners;
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
  @Input() avatarConfig: INotifyAvatarConfig = {
    src: null,
    size: 'w-10 h-10',
    mask: 'circle',
    placeholderSeed: 'avatar',
  };
  @Input() subAvatarConfig?: INotifyAvatarConfig = {
    src: null,
    size: 'w-6 h-6',
    mask: 'circle',
    placeholderSeed: '',
  };

  @Input() scrambleCacheOnChange = false;

  @Output() subAvatarClick = new EventEmitter<void>();

  public isMainAvatarLoaded = false;
  public isSubAvatarLoaded = false;
  public corners = EnumNotifyAPCorners;

  private _scrambleCache = `?cz=${Date.now()}`;

  public get loaded(): { [key: string]: boolean } {
    return {
      main: this.isMainAvatarLoaded,
      sub: this.isSubAvatarLoaded,
    };
  }

  public get cleanedConfigs() {
    const isMainUri =
      this.avatarConfig.src && this.avatarConfig.src.includes('http');
    const isSubUri =
      this.subAvatarConfig?.src && this.subAvatarConfig.src.includes('http');

    const main = {
      src: isMainUri
        ? this.avatarConfig.src + this._scrambleCache
        : this.avatarConfig.src,
      size: this.avatarConfig.size,
      mask: this.avatarConfig.mask,
      placeholderSeed: this.avatarConfig.placeholderSeed,
      backgroundColor: this.avatarConfig.backgroundColor,
      placeholderStyle: this.avatarConfig.placeholderStyle,
    };

    const _placement = this.subAvatarConfig?.placement;

    const vertical = _placement?.includes('top')
      ? 'top-0 -mt-1'
      : 'bottom-0 -mb-1';
    const horizontal = _placement?.includes('left')
      ? 'left-0 -ml-2'
      : 'right-0 -mr-2';

    const sub = {
      src: isSubUri
        ? this.subAvatarConfig?.src + this._scrambleCache
        : this.subAvatarConfig?.src,
      size: this.subAvatarConfig?.size,
      mask: this.subAvatarConfig?.mask,
      placeholderSeed: this.subAvatarConfig?.placeholderSeed,
      backgroundColor: this.avatarConfig.backgroundColor,
      placeholderStyle: this.subAvatarConfig?.placeholderStyle,
      placement:
        _placement === this.corners.None
          ? 'hidden'
          : `${vertical} ${horizontal}`,
    };

    return { main, sub };
  }

  public get placeholderAvatar(): { [key: string]: string } {
    return {
      main: this._utils.diceBearAvatar({
        style:
          this.avatarConfig.placeholderStyle ||
          EnumDicebearAvatarStyles.BigSmile,
        seed: this.avatarConfig.placeholderSeed || '',
      }),
      sub: this._utils.diceBearAvatar({
        style:
          this.subAvatarConfig?.placeholderStyle ||
          EnumDicebearAvatarStyles.BigSmile,
        seed: this.subAvatarConfig?.placeholderSeed || '',
      }),
    };
  }

  constructor(private _utils: UtilsService) {}

  public setLoaded(type: 'main' | 'sub') {
    if (type === 'main') {
      this.isMainAvatarLoaded = true;
      return;
    }

    this.isSubAvatarLoaded = true;
  }
  public ngOnChanges(): void {
    if (!this.scrambleCacheOnChange) {
      return;
    }

    this._scrambleCache = `?cz=${Date.now()}`;
  }
}
