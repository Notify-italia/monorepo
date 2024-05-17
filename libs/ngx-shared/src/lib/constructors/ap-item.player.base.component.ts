import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  EnumNotifyAPDirections,
  EnumNotifyUserType,
  INotifyProfile,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../modules/advanced-profile/services/advanced-profile-items.service';
import { TailwindFormsModule } from '../modules/tailwind-forms/tailwind-forms.module';
import { FormsService, UtilsService } from '../services';
import { LoadingComponent } from '../standalones';

export interface INotifyCustomTableValueBase {
  valueType: string;
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (value: any) => string;
}

export const AdvancedItemFormBaseImports = [
  CommonModule,
  TailwindFormsModule,
  LoadingComponent,
  RouterModule,
];
export const AdvancedItemFormBaseProviders = [
  AdvancedProfileItemsService,
  FormsService,
  UtilsService,
];

@Component({
  template: '',
  standalone: true,
})
export class AdvancedProfileItemPlayerBaseComponent<
  T extends NotifyAdvancedProfileItem
> implements OnInit
{
  private _apItemsSerivce = inject(AdvancedProfileItemsService);
  private _utilsSerivce = inject(UtilsService);
  private _domSanitizer = inject(DomSanitizer);

  @Input() profile!: INotifyProfile;
  @Input() currentItem!: T;
  @Input() manifest!: INotifyAdvancedProfileManifest;

  @Output() showCompanyProfile = new EventEmitter<void>();

  public get context() {
    return {
      services: {
        apItems: this._apItemsSerivce,
        utils: this._utilsSerivce,
        sanitizer: this._domSanitizer,
      },
      statics: {
        directions: EnumNotifyAPDirections,
      },
      getters: {
        isAgent: this.profile.type === EnumNotifyUserType.Agent,
        isCompany: this.profile.type === EnumNotifyUserType.Company,
        requiredItems: this._requiredItems(),
        isRequired: () =>
          this._requiredItemsIds().includes(this.currentItem._id),
        textSetings: this.textSettings,
        fontSize: this._fontSize,
        textColor: this._textColor,
        manifest: this.manifest,
        profile: this.profile,
        currentItem: this.currentItem,
        companyProfile: this.profile.company,
        container: {
          class: `size-full fonts font-${this._font}`,
          ngStyle: {
            'font-size': this._fontSize,
            color: this._textColor,
          },
        },
      },
    };
  }

  public get textSettings() {
    return this.currentItem.textConfig;
  }

  private get _font() {
    if (!this.textSettings.enabled) {
      return this.profile.advancedProfile?.pageSettings?.font;
    }

    return this.textSettings.font;
  }

  private get _fontSize() {
    if (!this.textSettings.enabled) {
      return `${this.profile.advancedProfile?.pageSettings?.fontSize}px`;
    }

    return `${this.textSettings.fontSize}px`;
  }

  private get _textColor() {
    if (!this.textSettings.enabled) {
      return this.profile.advancedProfile?.pageSettings?.textColor;
    }

    return this.textSettings.textColor;
  }

  private _requiredItems() {
    const requiredItems = this.profile.advancedProfile?.requiredItems;

    if (!requiredItems) {
      return [];
    }

    return Object.entries(requiredItems)
      .filter(([, value]) => value?.length)
      .map((v) => ({
        key: v[0],
        value: v[1],
      }));
  }

  private _requiredItemsIds() {
    return this._requiredItems().map((item) => item.value);
  }

  public ngOnInit(): void {
    this.componentReady();
  }

  public componentReady() {
    return;
  }
}
