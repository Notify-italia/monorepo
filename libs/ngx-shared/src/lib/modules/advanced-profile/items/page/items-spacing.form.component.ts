import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-background-items-spacing-form',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule],
  template: ` <div class="flex flex-col space-y-4">
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
  </div>`,
})
export class AdvancedProfileItemsSpacingFormComponent {
  @Input({ required: true }) pageSettingsForm!: FormGroup;
}
