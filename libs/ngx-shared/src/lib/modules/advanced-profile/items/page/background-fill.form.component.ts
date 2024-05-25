import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-background-fill-form',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule],
  template: ` <notify-tailwind-color-picker
    [parent]="pageSettingsForm"
    name="fill"
    class="w-full"
    [compact]="true"
  ></notify-tailwind-color-picker>`,
})
export class AdvancedProfileBackgroundFillFormComponent {
  @Input({ required: true }) pageSettingsForm!: FormGroup;
}
