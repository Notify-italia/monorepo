import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  EnumNotifyAPDirections,
  EnumNotifyUserType,
  INotifyProfile,
  NOTIFY_AP_DIRECTIONS_IT,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../modules/advanced-profile/services/advanced-profile-items.service';
import { CHECKBOX_TOGGLE_EYE } from '../modules/tailwind-forms/components/tailwind-checkbox/tailwind-checkbox.component';
import { INotifyTailwindDropzoneCdnConfig } from '../modules/tailwind-forms/components/tailwind-dropzone/tailwind-dropzone.component';
import { ITailwindSelectOption } from '../modules/tailwind-forms/components/tailwind-select/tailwind-select.component';
import { TailwindFormsModule } from '../modules/tailwind-forms/tailwind-forms.module';
import {
  AuthService,
  FormsService,
  UtilsService,
  controlsFromObject,
} from '../services';

export interface INotifyCustomTableValueBase {
  valueType: string;
  fieldName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer?: (value: any) => string;
}

export const AdvancedItemFormBaseImports = [CommonModule, TailwindFormsModule];
export const AdvancedItemFormBaseProviders = [
  AdvancedProfileItemsService,
  FormsService,
  UtilsService,
];

@Component({
  template: '',
  standalone: true,
})
export class AdvancedItemFormBaseComponent<T extends NotifyAdvancedProfileItem>
  implements OnInit
{
  private _authService = inject(AuthService);
  private _apItemsSerivce = inject(AdvancedProfileItemsService);
  private _formsService = inject(FormsService);
  public _utilsSerivce = inject(UtilsService);

  @Input() profile!: INotifyProfile;
  @Input() form!: FormGroup<controlsFromObject<T>>;
  @Input() formContext!: FormGroup<
    controlsFromObject<INotifyProfile['advancedProfile']>
  >;
  @Input() isRequired!: boolean;
  @Input() manifest!: INotifyAdvancedProfileManifest<T>;

  public directions = EnumNotifyAPDirections;
  public directionSelectOptions: ITailwindSelectOption[] = Object.values(
    this.directions
  ).map((value) => ({
    name: NOTIFY_AP_DIRECTIONS_IT[value],
    value: value as string,
  }));

  public cdnConfig!: INotifyTailwindDropzoneCdnConfig;
  public toggleEyeIcons = CHECKBOX_TOGGLE_EYE;

  public context = {
    authService: this._authService,
    apItemsService: this._apItemsSerivce,
    formsService: this._formsService,
    utilsService: this._utilsSerivce,
    advancedProfile: () => this.formContext.value,
  };

  public get isAgent() {
    return this._authService.user?.userType === EnumNotifyUserType.Agent;
  }

  public get isCompany() {
    return this._authService.user?.userType === EnumNotifyUserType.Company;
  }

  public get authHeaders() {
    return this._authService.authHeaders;
  }

  public get requiredItems() {
    const requiredItems = this.formContext.value?.requiredItems;

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

  public ngOnInit(): void {
    this._compareFormWithDefinition();

    this.cdnConfig = {
      postEndpoint: 'http://google.com',
      authorization: this.authHeaders,
      body: {
        item: this.form.value._id || '',
        profile: this.profile._id || '',
      },
      deleteEndpoint: '',
      deleteSchema: {
        name: 'name',
      },
      deleteExtraParams: {
        item: this.form.value._id || '',
        profile: this.profile._id || '',
      },
      responseSchema: {
        value: 'url',
      },
    };

    this.componentReady();
  }

  public componentReady() {
    return;
  }

  private _compareFormWithDefinition() {
    const formKeys = Object.keys(this.form.controls);
    const definitionKeys = Object.keys(this.manifest.definitions);

    const missingKeys = definitionKeys.filter(
      (key) =>
        !formKeys.includes(key) ||
        typeof this.form.get(key)?.value !==
          typeof this.manifest.definitions[key as keyof T]
    );

    if (!missingKeys.length) {
      return;
    }

    missingKeys.forEach((key: string) => {
      const defaultValue = this.manifest.definitions[key as keyof T];

      if (!this.form.get(key)) {
        (this.form as FormGroup).addControl(key, new FormControl(defaultValue));
        return;
      }
      this.form.controls[key as keyof T].setValue(defaultValue);
    });
  }
}
