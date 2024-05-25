import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  INotifyAPageSettings,
  INotifyProfile,
  NOTIFY_AP_BACKGROUND_TYPES_IT,
} from '@notify/interfaces';
import { ProfileService, UtilsService } from '../../../../services';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import {
  AdvancedProfileItemsService,
  advancedProfileForm,
} from '../../services/advanced-profile-items.service';
import { FONTS_ICON_SET } from '../../services/fonts.iconset';
import { AdvancedProfileBackgroundFillFormComponent } from './background-fill.form.component';
import { AdvancedProfileBackgroundGradientFormComponent } from './background-gradient.form.component';
import { AdvancedProfileBackgroundImageFormComponent } from './background-image.form.component';

const FORCE_UPDATE_KEYS: string[] = [];

@Component({
  selector: 'notify-page-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    IconSelectorComponent,
    AdvancedProfileBackgroundFillFormComponent,
    AdvancedProfileBackgroundImageFormComponent,
    AdvancedProfileBackgroundGradientFormComponent,
  ],
  providers: [AdvancedProfileItemsService, UtilsService, ProfileService],
  template: `
    <form
      [formGroup]="pageSettingsForm"
      *ngIf="pageSettingsForm"
      class="flex flex-col space-y-4"
    >
      <notify-tailwind-slider
        [parent]="pageSettingsForm"
        name="padding"
        label="Padding laterale"
        [steps]="5"
        [min]="0.5"
        [max]="3"
        [compact]="true"
      ></notify-tailwind-slider>
      <notify-tailwind-slider
        [parent]="pageSettingsForm"
        name="verticalSpacing"
        label="Spaziatura elementi"
        [steps]="20"
        [min]="0"
        [max]="2"
        [compact]="true"
      ></notify-tailwind-slider>

      <div class="divider"></div>

      <notify-tailwind-select
        [parent]="pageSettingsForm"
        [options]="backgroundSelectOptions"
        name="backgroundType"
        label="Tipo di sfondo"
        [compact]="true"
      ></notify-tailwind-select>

      <div class="flex flex-col space-y-4">
        @switch (backgroundType) { @case (backgroundTypes.Fill) {
        <notify-background-fill-form
          [pageSettingsForm]="pageSettingsForm"
        ></notify-background-fill-form>

        } @case (backgroundTypes.Gradient) {
        <notify-background-gradient-form
          [pageSettingsForm]="pageSettingsForm"
        ></notify-background-gradient-form
        >} @case (backgroundTypes.Image) {
        <notify-background-image-form
          [pageSettingsForm]="pageSettingsForm"
          [profile]="profile"
        ></notify-background-image-form>
        } }
      </div>

      <div class="divider"></div>

      <span class="font-medium">Stile testo</span>
      <div class="flex justify-between space-x-2 items-center">
        <notify-icon-selector
          [iconSet]="fontsIconSet"
          [icon]="pageSettingsForm.value.font"
          title="Carattere"
          [openSelectorOnBoot]="false"
          [showIconLabel]="false"
          (iconChange)="setFont($event.new?.name || 'poppins')"
        ></notify-icon-selector>
        <notify-tailwind-color-picker
          [parent]="pageSettingsForm"
          name="textColor"
          class="w-7/12"
          [compact]="true"
        ></notify-tailwind-color-picker>
        <notify-tailwind-input
          class="!mb-1 w-3/12"
          [parent]="pageSettingsForm"
          name="fontSize"
          label=" "
          [compact]="true"
          [showSpinButtons]="true"
          type="number"
          [showClearInput]="false"
        ></notify-tailwind-input>
      </div>
    </form>
  `,
})
export class PageFormComponent implements OnInit {
  private _apItems = inject(AdvancedProfileItemsService);

  @Input({ required: true }) form!: advancedProfileForm;
  @Input({ required: true }) profile!: INotifyProfile;

  public fontsIconSet = FONTS_ICON_SET;
  public backgroundTypes = EnumNotifyAPBackgroundTypes;

  public get pageSettingsForm() {
    return this.form.controls?.pageSettings as unknown as FormGroup;
  }

  public get backgroundType() {
    return this.pageSettingsForm.controls['backgroundType'].value;
  }

  public backgroundSelectOptions = this._apItems.createSelectOptions(
    EnumNotifyAPBackgroundTypes,
    NOTIFY_AP_BACKGROUND_TYPES_IT
  );

  public ngOnInit() {
    this._compareFormWithDefaults();
  }

  public setFont(font: string) {
    this.pageSettingsForm.controls['font'].setValue(font);
  }

  private _compareFormWithDefaults() {
    const _pageSettingsForm = this.form.controls
      ?.pageSettings as unknown as FormGroup;

    const _defaults = ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS;

    const formKeys = Object.keys(_pageSettingsForm?.value);
    const defaultKeys = Object.keys(_defaults);

    const missingKeys = defaultKeys.filter((key) => !formKeys.includes(key));

    if (!missingKeys.length) {
      return;
    }

    [...FORCE_UPDATE_KEYS, ...missingKeys].forEach((key: string) => {
      const defaultValue = _defaults[key as keyof typeof _defaults];

      if (!this.form.get(key)) {
        _pageSettingsForm.addControl(key, new FormControl(defaultValue));
        return;
      }
      _pageSettingsForm.controls[key]?.setValue(defaultValue);
    });
  }
}

export const ADVANCED_PROFILE_PAGE_SETTINGS_DEFAULTS: INotifyAPageSettings = {
  backgroundType: EnumNotifyAPBackgroundTypes.Fill,
  imgSrc: '',
  fill: '#000000',
  gradient: {
    direction: EnumNotifyAPDirections.Vertical,
    colors: [{ value: '#000000' }, { value: '#000000' }],
  },
  pattern: {
    pattern: '',
    color: '',
  },
  textColor: '#ffffff',
  font: 'Poppins',
  fontSize: 16,
  align: EnumNotifyAPAlign.Start,
  padding: 0.625,
  verticalSpacing: 0.5,
};
