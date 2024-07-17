import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { FONTS_ICON_SET } from '../../services/fonts.iconset';

@Component({
  selector: 'notify-page-font-form',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, IconSelectorComponent],
  template: ` <div class="flex flex-col space-y-4">
    <small class="font-medium">Stile testo</small>
    <div class="flex  space-x-2 items-center">
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
    </div>
    <notify-tailwind-slider
      [parent]="pageSettingsForm"
      name="fontSize"
      [compact]="true"
      [steps]="fontSizeSettings.steps"
      [min]="fontSizeSettings.min"
      [max]="fontSizeSettings.max"
      [label]="fontSizeSettings.label"
      [stepsLabels]="{
        stepSuffix: fontSizeSettings.stepSuffix,
        showCurrentStep: true,
        stepPosition: 'bottom'
      }"
    ></notify-tailwind-slider>
  </div>`,
})
export class AdvancedProfilePageFontFormComponent {
  @Input({ required: true }) pageSettingsForm!: FormGroup;

  public fontsIconSet = FONTS_ICON_SET;

  public setFont(font: string) {
    this.pageSettingsForm.controls['font'].setValue(font);
  }

  public get fontSizeSettings() {
    return {
      label: 'Dimensione Testo',
      min: 0,
      max: 50,
      steps: 20,
      stepSuffix: 'px',
    };
  }
}
