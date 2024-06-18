import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPContainerStyles,
  EnumNotifyAPDirections,
  EnumNotifyAPObjectFit,
  EnumNotifyUserType,
  INotifyProfile,
  NOTIFY_AP_ALIGN_IT,
  NOTIFY_AP_BUTTON_STYLES_IT,
  NOTIFY_AP_DIRECTIONS_IT,
  NOTIFY_AP_OBJECT_FIT_IT,
  NotifyAdvancedProfileItem,
} from '@notify/interfaces';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
  AdvancedProfileItemsService,
  INotifyAdvancedProfileManifest,
} from '../modules/advanced-profile/services/advanced-profile-items.service';
import { CHECKBOX_TOGGLE_EYE } from '../modules/tailwind-forms/components/tailwind-checkbox/tailwind-checkbox.component';
import { TailwindFormsModule } from '../modules/tailwind-forms/tailwind-forms.module';
import {
  AuthService,
  FormsService,
  ProfileService,
  UtilsService,
  controlsFromObject,
} from '../services';
import {
  ImageCropperFactory,
  LoadingComponent,
  UploadComponent,
} from '../standalones';
import { IImageCropperConfig } from '../standalones/image-cropper/image-cropper.component';

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
  UploadComponent,
  ReactiveFormsModule,
];
export const AdvancedItemFormBaseProviders = [
  AdvancedProfileItemsService,
  FormsService,
  UtilsService,
  ProfileService,
  ImageCropperFactory,
];

@Component({
  template: '',
  standalone: true,
})
export class AdvancedProfileItemFormBaseComponent<
  T extends NotifyAdvancedProfileItem
> implements OnInit, OnDestroy
{
  private _authService = inject(AuthService);
  private _apItemsSerivce = inject(AdvancedProfileItemsService);
  private _formsService = inject(FormsService);
  private _utilsSerivce = inject(UtilsService);
  private _profileService = inject(ProfileService);
  private _imageCropper = inject(ImageCropperFactory);

  @Input() profile!: INotifyProfile;
  @Input() form!: FormGroup<controlsFromObject<T>>;
  @Input() formContext!: FormGroup<
    controlsFromObject<INotifyProfile['advancedProfile']>
  >;
  @Input() manifest!: INotifyAdvancedProfileManifest<T>;
  @Input() private environment!: Record<string, unknown>;

  private fileData: File | null = null;
  private _imageCropperConfig?: Partial<IImageCropperConfig>;

  private _destroy$ = new Subject<void>();

  public get context() {
    return {
      services: {
        auth: this._authService,
        apItems: this._apItemsSerivce,
        forms: this._formsService,
        utils: this._utilsSerivce,
        profile: this._profileService,
      },
      getters: {
        environment: this.environment,
        formContext: this.formContext,
        advancedProfile: this.formContext.value,
        isAgent: this.profile.type === EnumNotifyUserType.Agent,
        isCompany: this.profile.type === EnumNotifyUserType.Company,
        requiredItems: this._requiredItems(),
        isRequired: this._requiredItemsIds().includes(this.form.value._id),
        itemValue: this.form.value,
        profile: this.profile,
        formChanged: this.form.valueChanges.pipe(takeUntil(this._destroy$)),
      },
      statics: {
        buttonStyles: EnumNotifyAPContainerStyles,
        directions: EnumNotifyAPDirections,
        objectFit: EnumNotifyAPObjectFit,
      },
      components: {
        select: {
          buttonStyles: this._apItemsSerivce.createSelectOptions(
            EnumNotifyAPContainerStyles,
            NOTIFY_AP_BUTTON_STYLES_IT
          ),
          directions: this._apItemsSerivce.createSelectOptions(
            EnumNotifyAPDirections,
            NOTIFY_AP_DIRECTIONS_IT
          ),
          align: this._apItemsSerivce.createSelectOptions(
            EnumNotifyAPAlign,
            NOTIFY_AP_ALIGN_IT
          ),
          objectFit: this._apItemsSerivce.createSelectOptions(
            EnumNotifyAPObjectFit,
            NOTIFY_AP_OBJECT_FIT_IT
          ),
        },
        upload: {
          fileData: this.fileData,
          setControlValue: this.setFileControlValue.bind(this),
          setCropperConfig: (config: Partial<IImageCropperConfig>) =>
            (this._imageCropperConfig = config),
          getFileName: this._fileNameFormUrl.bind(this),
          init: this._initFileData.bind(this),
          setFileData: (value: File | null) => (this.fileData = value),
        },
        checkbox: {
          toggleEye: CHECKBOX_TOGGLE_EYE,
          outlineToggleEye: {
            checked: CHECKBOX_TOGGLE_EYE.checked,
            unchecked: CHECKBOX_TOGGLE_EYE.unchecked,
            button: `btn btn-sm btn-outline`,
          },
        },
      },
    };
  }

  public ngOnInit(): void {
    this._compareFormWithDefinition();

    this.componentReady();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public componentReady() {
    return;
  }

  private _requiredItems() {
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

  private _requiredItemsIds() {
    return this._requiredItems().map((item) => item.value);
  }

  public setFileControlValue(
    event: {
      file: File | null;
      blob: string | ArrayBuffer | null;
    },
    control: keyof FormGroup<controlsFromObject<T>>['controls']
  ) {
    const profileId = this.context.getters.profile._id;
    const itemId = this.context.getters.itemValue._id || '';

    const formControl = this.form.controls[control];

    if (!event.file) {
      this.fileData = null;
      const fileName = this._fileNameFormUrl(formControl.value);
      formControl.setValue(null);
      this.context.services.profile
        .deleteFile(profileId, itemId, fileName)
        .subscribe();

      return;
    }

    if (this._imageCropperConfig) {
      const { instance } = this._imageCropper.create({
        ...this._imageCropperConfig,
        imageData: event.file,
      });

      instance.destroyed$.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._refreshFileData(control);
      });

      instance.submitted
        .pipe(
          tap((result) => {
            event.blob = result;
          }),
          switchMap(() => this._uploadFile(event, profileId, itemId, control))
        )
        .subscribe();

      return;
    }

    this._uploadFile(event, profileId, itemId, control).subscribe();
  }

  private _uploadFile(
    event: {
      file: File | null;
      blob: string | ArrayBuffer | null;
    },
    profileId: string,
    itemId: string,
    control: keyof FormGroup<controlsFromObject<T>>['controls']
  ) {
    return this.context.services.profile
      .uploadFile(
        {
          blob: event.blob,
          name: event.file?.name || 'file',
        },
        profileId,
        itemId
      )
      .pipe(
        tap((r) => {
          this.form.controls[control]?.setValue(r.url);
          this._refreshFileData(control);
        })
      );
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

  private _fileNameFormUrl(url: string) {
    return url.split('/').pop()?.split('?')[0] || 'file';
  }

  private async _initFileData(
    control: keyof FormGroup<controlsFromObject<T>>['controls'],
    cropper?: Partial<IImageCropperConfig>
  ) {
    const formControl = this.form.controls[control];
    const result = await fetch(formControl?.value || '')
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        if (!blob || blob.type === 'text/html') {
          return null;
        }

        return this._generateFile(
          blob,
          this.context.components.upload.getFileName(
            formControl?.value || ''
          ) || 'image.jpg',

          blob.type
        );
      });

    if (cropper) {
      this._imageCropperConfig = cropper;
    }
    this.context.components.upload.setFileData(result);
  }

  private async _refreshFileData(
    control: keyof FormGroup<controlsFromObject<T>>['controls']
  ) {
    const formControl = this.form.controls[control];
    const result = await fetch(formControl?.value || '')
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        if (!blob || blob.type === 'text/html') {
          return null;
        }

        return this._generateFile(
          blob,
          this.context.components.upload.getFileName(
            formControl?.value || ''
          ) || 'image.jpg',

          blob.type
        );
      });
    this.context.components.upload.setFileData(result);
  }

  private _generateFile(
    blob: BlobPart,
    name: string,
    type: string
  ): File | null {
    return new File([blob], name, { type });
  }
}
