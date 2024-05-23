import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  EnumNotifyAPButtonStyles,
  EnumNotifyAPDirections,
  EnumNotifyAPObjectFit,
  EnumNotifyUserType,
  INotifyProfile,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import { Subject, takeUntil } from 'rxjs';
import {
  ADVANCED_PROFILE_CLICK_EVENTS,
  AdvancedProfileItemOutputsService,
  CREATE_IFRAME_MODAL_CONFIG,
} from '../modules/advanced-profile/services/advanced-profile-item-outputs.service';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../modules/advanced-profile/services/advanced-profile-items.service';
import { SvgboxService, UtilsService } from '../services';
import {
  LoadingComponent,
  NoItemsComponent,
  SvgBoxIconComponent,
} from '../standalones';

export interface INotifyCustomTableValueBase {
  valueType: string;
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (value: any) => string;
}

export const AdvancedItemPlayerBaseImports = [
  CommonModule,
  RouterModule,
  NoItemsComponent,
  LoadingComponent,
  SvgBoxIconComponent,
];
export const AdvancedItemPlayerBaseProviders = [
  AdvancedProfileItemsService,
  UtilsService,
];

@Component({
  template: '',
  standalone: true,
})
export class AdvancedProfileItemPlayerBaseComponent<
  T extends NotifyAdvancedProfileItem
> implements OnInit, OnChanges, OnDestroy
{
  private _apItemsSerivce = inject(AdvancedProfileItemsService);
  private _utilsSerivce = inject(UtilsService);
  private _domSanitizer = inject(DomSanitizer);
  private _apOutputsService = inject(AdvancedProfileItemOutputsService);
  private _svgBoxService = inject(SvgboxService);

  @Input() profile!: INotifyProfile;
  @Input() currentItem!: T;
  @Input() manifest!: INotifyAdvancedProfileManifest;
  @Input() isRunningOnPlayer = false;

  private _componentChanged$ = new Subject<void>();
  private _componentDestroyed$ = new Subject<void>();

  public get context() {
    return {
      services: {
        apItems: this._apItemsSerivce,
        utils: this._utilsSerivce,
        sanitizer: this._domSanitizer,
        svgBox: this._svgBoxService,
      },
      statics: {
        directions: EnumNotifyAPDirections,
        buttonStyles: EnumNotifyAPButtonStyles,
        objectFit: EnumNotifyAPObjectFit,
      },
      emitters: {
        itemClicked: <T>(data: T, eventName: ADVANCED_PROFILE_CLICK_EVENTS) => {
          this._apOutputsService.onItemClicked({
            item: this.currentItem,
            eventData: data,
            eventName,
          });
        },
      },
      methods: {
        createIframeModal: this._createIframeModal.bind(this),
      },
      getters: {
        isRunningOnPlayer: this.isRunningOnPlayer,
        isAgent: this.profile.type === EnumNotifyUserType.Agent,
        isCompany: this.profile.type === EnumNotifyUserType.Company,
        requiredItems: this._requiredItems(),
        isRequired: this._requiredItemsIds().includes(this.currentItem._id),
        textSettings: this.textSettings,
        fontSize: this._fontSize,
        textColor: this._textColor,
        manifest: this.manifest,
        profile: this.profile,
        currentItem: this.currentItem,
        companyProfile: this.profile.company,
        pageSettings: this.profile.advancedProfile?.pageSettings,
        componentChanged$: this._componentChanged$.pipe(
          takeUntil(this._componentDestroyed$)
        ),
        container: {
          class: `size-full fonts font-${this._font}`,
          ngStyle: {
            'font-size': this._fontSize,
            color: this._textColor,
          },
          ngClass: {
            'pointer-events-none': !this.isRunningOnPlayer,
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
      return this.profile.advancedProfile?.pageSettings?.textColor || '#000000';
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

  private _createIframeModal(url: string, title: string) {
    this._apOutputsService.onItemClicked<CREATE_IFRAME_MODAL_CONFIG>({
      item: this.currentItem,
      eventData: {
        url,
        title,
        navbarStyle: {
          backgroundColor: this._textColor,
          color: this._utilsSerivce.getContrstingColor(this._textColor),
        },
      },
      eventName: 'CREATE_IFRAME_MODAL',
    });
  }

  public ngOnInit(): void {
    this.componentReady();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const updatedItem = JSON.stringify(
      (
        changes['profile'].currentValue as INotifyProfile
      )?.advancedProfile?.items.find((i) => i._id === this.currentItem._id)
    );

    const currentItem = JSON.stringify(
      (
        changes['profile'].previousValue as INotifyProfile
      )?.advancedProfile?.items.find((i) => i._id === this.currentItem._id)
    );

    if (updatedItem === currentItem) {
      return;
    }

    this._componentChanged$.next();
  }

  public ngOnDestroy() {
    this._componentDestroyed$.next();
  }

  public componentReady() {
    return;
  }
}
