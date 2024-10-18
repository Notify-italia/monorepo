import { Component } from '@angular/core';
import { INotifyAPAvatarItem, daisyUIAvatarMaks } from '@notify/interfaces';
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
      <div
        class="flex items-center w-full"
        [ngClass]="{
          'flex-col space-y-4':
            currentItem.direction === this.context.statics.directions.Vertical || !isDaisyUIMask,
          'space-x-6':
            currentItem.direction ===
            this.context.statics.directions.Horizontal && isDaisyUIMask,
          
        }"
        [ngStyle]="{
          'align-items':!isDaisyUIMask ?'stretch' : alignment ,
          height: currentItem.imgSize + '%',
          'flex-direction': flexDirection,
        }"
      >
        @switch (currentItem.imgMask) { @case ('adaptive') {
        <div class="flex flex-col items-center" *ngIf="currentItem.imgSrc">
          <img
            [src]="currentItem.imgSrc"
            class="size-full rounded-xl"
            loading="lazy"
            [ngStyle]="{
              scale: currentItem.imgSize / 100,
              'object-fit': currentItem.imgFit
            }"
          />
        </div>
        } @case ('banner') {
        <div class="flex flex-col items-center" *ngIf="currentItem.imgSrc">
          <img
            (load)="avatarLoaded = true"
            [src]="currentItem.imgSrc"
            *ngIf="currentItem.imgSrc"
            class="w-full h-48 rounded-xl"
            alt="Avatar"
            [ngStyle]="{
              scale: currentItem.imgSize / 100,
              'object-fit': currentItem.imgFit
            }"
          />
          <div
            class="h-48 rounded-xl w-full object-contain smooth bg-gray-600 animate-pulse "
            *ngIf="!avatarLoaded"
          ></div>
        </div>
        } @default {

        <notify-avatar
          [avatarConfig]="avatarConfig"
          [subAvatarConfig]="companyAvatarConfig"
          (subAvatarClick)="
            context.emitters.itemEvent(null, 'SHOW_COMPANY_PROFILE')
          "
          [ngStyle]="{
            scale: currentItem.imgSize / 100,
          }"
        ></notify-avatar>

        } }
        <div
          class="flex flex-col"
          [ngStyle]="{
            'text-align':
              currentItem.direction ===
                this.context.statics.directions.Vertical || !isDaisyUIMask
                ? alignment
                : 'start'
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
    </div>
  `,
})
export class AvatarPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPAvatarItem> {
  public dicebearAvatarStyles = EnumDicebearAvatarStyles;
  public avatarLoaded = false;

  public get alignment() {
    if (
      this.currentItem.direction === this.context.statics.directions.Vertical ||
      !this.isDaisyUIMask
    ) {
      switch (this.currentItem.align) {
        case this.context.statics.aligns.Start:
          return 'start';
        case this.context.statics.aligns.Center:
          return 'center';
        case this.context.statics.aligns.End:
          return 'end';
      }
    }

    return 'center';
  }

  public get flexDirection() {
    if (
      this.currentItem.direction !==
        this.context.statics.directions.Horizontal ||
      !this.isDaisyUIMask
    ) {
      return 'column';
    }

    switch (this.currentItem.align) {
      case this.context.statics.aligns.Start:
        return 'row';
      case this.context.statics.aligns.Center:
        return 'row';
      case this.context.statics.aligns.End:
        return 'row-reverse';
    }

    return 'row';
  }

  public get isDaisyUIMask() {
    return (
      daisyUIAvatarMaks.some((v) => v === this.currentItem.imgMask) ||
      this.currentItem.imgMask === ''
    );
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

    const hasDaisyUIAvatarMask = daisyUIAvatarMaks.some(
      (v) => v === companyAvatar?.imgMask
    );

    return {
      src: companyAvatar?.imgSrc,
      size,
      mask: hasDaisyUIAvatarMask ? companyAvatar?.imgMask : '',
      placeholderStyle: EnumDicebearAvatarStyles.Bottts,
      placeholderSeed: company?._id || '',
      backgroundColor: hasDaisyUIAvatarMask
        ? this.context.getters.textColor
        : '',
      placement,
    };
  }
}
