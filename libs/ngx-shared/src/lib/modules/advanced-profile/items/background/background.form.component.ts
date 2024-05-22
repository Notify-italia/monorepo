import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  EnumNotifyAPAlign,
  EnumNotifyAPBackgroundTypes,
  EnumNotifyAPDirections,
  INotifyAPageSettings,
  NOTIFY_AP_BACKGROUND_TYPES_IT,
  NOTIFY_AP_DIRECTIONS_IT,
} from '@notify/interfaces';
import { UtilsService } from '../../../../services';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import {
  AdvancedProfileItemsService,
  advancedProfileForm,
} from '../../services/advanced-profile-items.service';
import { FONTS_ICON_SET } from '../../services/fonts.iconset';

const FORCE_UPDATE_KEYS: string[] = [];

@Component({
  selector: 'notify-background-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    IconSelectorComponent,
    DragDropModule,
  ],
  providers: [AdvancedProfileItemsService, UtilsService],
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
        <notify-tailwind-color-picker
          [parent]="pageSettingsForm"
          name="fill"
          class="w-full"
          [compact]="true"
        ></notify-tailwind-color-picker>

        } @case (backgroundTypes.Gradient) {

        <notify-tailwind-select
          [parent]="gradientForm.fg"
          [options]="gradientDirections"
          name="direction"
          label="Direzione"
          [compact]="true"
        ></notify-tailwind-select>

        <button class="btn btn-sm w-full" (click)="addGradientItem()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clip-rule="evenodd"
            />
          </svg>

          <span>Aggiungi</span>
        </button>
        <div
          class="flex flex-col space-y-4 "
          cdkDropList
          (cdkDropListDropped)="updateGradientDropList($event)"
        >
          @for (item of gradientForm.colorsFa.controls; track $index) {
          <div class="flex space-x-2 items-center px-2 cdkDrag" cdkDrag>
            <notify-tailwind-color-picker
              [parent]="item"
              name="value"
              class="w-full"
              [compact]="true"
            ></notify-tailwind-color-picker>
            <button
              class="btn btn-sm btn-error btn-outline btn-square"
              (click)="removeGradientItem($index)"
              data-theme="notifytheme"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          }
          <small class="text-center" *ngIf="gradientForm.colorsFa.value.length">
            Fai click per scegliere un colore o trascina per riordinare
          </small>
        </div>
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
export class BackgroundFormComponent implements OnInit {
  private _apItems = inject(AdvancedProfileItemsService);
  private _utils = inject(UtilsService);

  @Input() form!: advancedProfileForm;

  public fontsIconSet = FONTS_ICON_SET;
  public backgroundTypes = EnumNotifyAPBackgroundTypes;

  public gradientDirections = this._apItems.createSelectOptions(
    EnumNotifyAPDirections,
    NOTIFY_AP_DIRECTIONS_IT
  );

  public get pageSettingsForm() {
    return this.form.controls?.pageSettings as unknown as FormGroup;
  }

  public get gradientForm() {
    const fg = this.pageSettingsForm.controls[
      'gradient'
    ] as unknown as FormGroup;
    const colorsFa = fg.controls['colors'] as unknown as FormArray<FormGroup>;

    return {
      fg,
      colorsFa,
    };
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

  public addGradientItem() {
    const colorsFa = this.gradientForm.colorsFa as unknown as FormArray;
    colorsFa.push(
      new FormGroup({
        value: new FormControl(this._utils.randomColor()),
      })
    );
  }

  public updateGradientDropList(event: CdkDragDrop<string[]>) {
    const colorsFa = this.gradientForm.colorsFa as unknown as FormArray;
    const controlToMove = colorsFa.controls[event.previousIndex];

    colorsFa.removeAt(event.previousIndex);
    colorsFa.insert(event.currentIndex, controlToMove);
  }

  public removeGradientItem(index: number) {
    const colorsFa = this.gradientForm.colorsFa as unknown as FormArray;
    colorsFa.removeAt(index);
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
