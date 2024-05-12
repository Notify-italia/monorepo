import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  INotifyProfile,
  NotifyAdvancedProfileItemTypes,
} from '@notify/interfaces';
import { controlsFromObject } from '../../../../services';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  selector: 'notify-part-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  providers: [AdvancedProfileItemsService],
  templateUrl: './part-settings.component.html',
})
export class PartSettingsComponent {
  private _apItemsSerivce = inject(AdvancedProfileItemsService);

  public showHiddenToggle = {
    checked: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.82 9-5.391 0-9.877-3.88-10.818-9C2.12 6.88 6.608 3 12 3Zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19Zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
  </svg>`,
    unchecked: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m9.342 18.781-1.931-.518.787-2.939a10.99 10.99 0 0 1-3.237-1.872l-2.153 2.154-1.415-1.415 2.154-2.153a10.957 10.957 0 0 1-2.371-5.07l1.968-.359C3.903 10.811 7.579 14 12 14c4.42 0 8.097-3.188 8.856-7.39l1.968.358a10.958 10.958 0 0 1-2.37 5.071l2.153 2.153-1.415 1.415-2.153-2.154a10.99 10.99 0 0 1-3.237 1.872l.787 2.94-1.931.517-.788-2.94a11.07 11.07 0 0 1-3.74 0l-.788 2.94Z"></path>
  </svg>`,
  };

  @Input({ required: true }) form!: FormGroup<
    controlsFromObject<INotifyProfile['advancedProfile']>
  >;
  @Input() selectedHierarchyItem = 'background';

  public get currentItem() {
    const form = this.form.controls?.['items'].controls.find(
      (fg) => fg.controls._id.value === this.selectedHierarchyItem
    );

    if (!form) {
      return null;
    }

    const manifest = this._apItemsSerivce.getManifest(
      form.value.type as NotifyAdvancedProfileItemTypes
    );

    return { form, manifest };
  }
}
