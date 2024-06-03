import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
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
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import {
  AdvancedProfileItemsService,
  advancedProfileForm,
} from '../../services/advanced-profile-items.service';
import { AdvancedProfileBackgroundFillFormComponent } from './background-fill.form.component';
import { AdvancedProfileBackgroundGradientFormComponent } from './background-gradient.form.component';
import { AdvancedProfileBackgroundImageFormComponent } from './background-image.form.component';
import { AdvancedProfileItemsSpacingFormComponent } from './items-spacing.form.component';
import { AdvancedProfilePageFontFormComponent } from './page-font.form.component';
import { PersonalizeLinkFormComponent } from './personalize-link.form.component';

const FORCE_UPDATE_KEYS: string[] = [];

@Component({
  selector: 'notify-page-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    AdvancedProfilePageFontFormComponent,
    AdvancedProfileBackgroundFillFormComponent,
    AdvancedProfileBackgroundImageFormComponent,
    AdvancedProfileBackgroundGradientFormComponent,
    AdvancedProfileItemsSpacingFormComponent,
    PersonalizeLinkFormComponent,
  ],
  providers: [AdvancedProfileItemsService, UtilsService, ProfileService],
  template: `
    <form
      [formGroup]="pageSettingsForm"
      *ngIf="pageSettingsForm"
      class="flex flex-col space-y-4"
    >
      <notify-personalize-link-form
        [pageSettingsForm]="pageSettingsForm"
        [profile]="profile"
        [baseUrl]="environment['profilesUrl']"
        (profileIdentifierChanged)="profileIdentifierChanged.emit($event)"
      ></notify-personalize-link-form>

      @if(profile.config.redirectEnabled) {
      <notify-tailwind-input
        [parent]="pageSettingsForm"
        name="redirectUrl"
        label="reindirizzamento"
        prefix="https://"
        placeholder="notifyapp.it"
        [compact]="true"
      ></notify-tailwind-input>

      }@else {
      <div class="divider"></div>
      <notify-background-items-spacing-form
        [pageSettingsForm]="pageSettingsForm"
      ></notify-background-items-spacing-form>

      <div class="divider"></div>

      <notify-page-font-form
        [pageSettingsForm]="pageSettingsForm"
      ></notify-page-font-form>

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
      }
    </form>
  `,
})
export class PageFormComponent implements OnInit {
  private _apItems = inject(AdvancedProfileItemsService);

  @Input({ required: true }) form!: advancedProfileForm;
  @Input({ required: true }) profile!: INotifyProfile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) environment!: Record<string, any>;

  @Output() profileIdentifierChanged = new EventEmitter<string>();

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
  textColor: '#ffffff',
  font: 'Poppins',
  fontSize: 16,
  align: EnumNotifyAPAlign.Start,
  padding: 0.625,
  verticalSpacing: 0.5,
  redirectUrl: '',
};
