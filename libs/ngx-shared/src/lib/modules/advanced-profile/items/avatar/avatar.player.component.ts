import { Component } from '@angular/core';
import { INotifyAPAvatarItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { EnumDicebearAvatarStyles } from '../../../../services';
import { AvatarComponent, INotifyAvatarConfig } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [...AdvancedItemPlayerBaseImports, AvatarComponent],
  providers: AdvancedItemPlayerBaseProviders,
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      @if(currentItem.imgMask !== 'banner') {
      <div
        class="flex items-center w-full"
        [ngClass]="{
          'flex-col space-y-4':
            currentItem.direction === this.context.statics.directions.Vertical,
          'flex-row space-x-6':
            currentItem.direction === this.context.statics.directions.Horizontal
        }"
      >
        <notify-avatar
          [avatarConfig]="avatarConfig"
          [subAvatarConfig]="companyAvatarConfig"
          (subAvatarClick)="
            context.emitters.itemClicked(null, 'SHOW_COMPANY_PROFILE')
          "
        ></notify-avatar>
        <div
          class="flex flex-col"
          [ngClass]="{
          'text-center':
            currentItem.direction === this.context.statics.directions.Vertical,
          
        }"
        >
          <span class="font-bold mt-1">
            {{ currentItem.label }}
          </span>
          <small class="italic opacity-80">
            {{ currentItem.sublabel }}
          </small>
          <small>
            <small class="mt-2 opacity-70 whitespace-pre-line">
              {{ currentItem.description }}
            </small>
          </small>
        </div>
      </div>
      } @else {
      <div class="flex flex-col items-center">
        <img
          [src]="currentItem.imgSrc"
          class="w-full h-48 rounded-xl object-cover"
          alt="Avatar"
        />

        <span class="font-bold mt-2">
          {{ currentItem.label }}
        </span>
        <small class="italic opacity-80">
          {{ currentItem.sublabel }}
        </small>
        <small>
          <small class="mt-2 opacity-70 whitespace-pre-line">
            {{ currentItem.description }}
          </small>
        </small>
      </div>
      }
    </div>
  `,
})
export class AvatarPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPAvatarItem> {
  public dicebearAvatarStyles = EnumDicebearAvatarStyles;

  public get imgSrc() {
    return;
  }

  public get avatarConfig(): INotifyAvatarConfig {
    return {
      src: this.currentItem?.imgSrc,
      size: '36',
      mask: this.currentItem.imgMask || '',
      placeholderSeed: this.context.getters.profile._id || '',
      backgroundColor: this.currentItem.imgMask
        ? this.context.getters.textColor
        : '',
      placeholderStyle: this.context.getters.isAgent
        ? this.dicebearAvatarStyles.BigSmile
        : this.dicebearAvatarStyles.Bottts,
    };
  }

  public get companyAvatarConfig(): INotifyAvatarConfig | undefined {
    if (!this.context.getters.isAgent) {
      return undefined;
    }

    const size = '12';
    const placement = this.context.getters.currentItem.ownerImgCorner;
    const company = this.context.getters.companyProfile;

    if (!company?.advancedProfile?.enabled) {
      return {
        src: company?.avatar || '',
        size,
        mask: company?.config?.avatarMask || '',
        placeholderStyle: EnumDicebearAvatarStyles.Bottts,
        placeholderSeed: company?._id || '',
        placement,
      };
    }

    const companyAvatar = company?.advancedProfile?.items.find(
      (i) => i._id === company.advancedProfile?.requiredItems.avatar
    ) as INotifyAPAvatarItem;

    if (!companyAvatar) {
      return {
        src: company?.avatar || '',
        size,
        mask: company?.config?.avatarMask || '',
        placeholderStyle: EnumDicebearAvatarStyles.Bottts,
        placeholderSeed: company?._id || '',
        placement,
      };
    }

    return {
      src: companyAvatar?.imgSrc,
      size,
      mask: companyAvatar?.imgMask || '',
      placeholderStyle: EnumDicebearAvatarStyles.Bottts,
      placeholderSeed: company?._id || '',
      placement,
    };
  }
}
