import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  INotifyAPageSettings,
  NOTIFY_AP_BACKGROUND_TYPES_IT,
} from '@notify/interfaces';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import {
  AdvancedProfileItemsService,
  advancedProfileForm,
} from '../../services/advanced-profile-items.service';
import { FONTS_ICON_SET } from './fonts.iconset';

@Component({
  selector: 'notify-background-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    IconSelectorComponent,
  ],
  providers: [AdvancedProfileItemsService],
  template: `
    <form
      [formGroup]="pageSettingsForm"
      *ngIf="pageSettingsForm"
      class="flex flex-col space-y-4"
    >
      <notify-tailwind-select
        [parent]="pageSettingsForm"
        [options]="backgroundSelectOptions"
        name="backgroundType"
        label="Tipo di sfondo"
        [compact]="true"
      ></notify-tailwind-select>

      <div class="divider"></div>

      <span>Testo</span>
      <div class="flex justify-between space-x-2 items-center">
        <notify-icon-selector
          [iconSet]="fontsIconSet"
          [icon]="pageSettingsForm.value.font"
          [openSelectorOnBoot]="false"
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

      <label
        class="fonts font-{{ pageSettingsForm.value.font }}"
        [ngStyle]="
{          color: pageSettingsForm.value.textColor,
    'font-size': pageSettingsForm.value.fontSize + 'px',
}
        "
      >
        La maggior parte del testo avrà questo stile
      </label>
    </form>
  `,
})
export class BackgroundFormComponent implements OnInit {
  private _apItems = inject(AdvancedProfileItemsService);

  @Input() form!: advancedProfileForm;

  public fontsIconSet = FONTS_ICON_SET;

  public get pageSettingsForm() {
    return this.form.controls?.pageSettings as unknown as FormGroup;
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

    missingKeys.forEach((key: string) => {
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
    colors: ['#000000', '#000000'],
  },
  pattern: {
    pattern: '',
    color: '',
  },
  textColor: '#ffffff',
  font: 'Poppins',
  fontSize: 16,
  align: EnumNotifyAPAlign.Start,
};
