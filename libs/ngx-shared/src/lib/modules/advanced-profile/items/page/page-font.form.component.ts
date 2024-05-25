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
  </div>`,
})
export class AdvancedProfilePageFontFormComponent {
  @Input({ required: true }) pageSettingsForm!: FormGroup;

  public fontsIconSet = FONTS_ICON_SET;

  public setFont(font: string) {
    this.pageSettingsForm.controls['font'].setValue(font);
  }
}
