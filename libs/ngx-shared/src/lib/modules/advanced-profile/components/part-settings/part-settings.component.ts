import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  INotifyProfile,
  NotifyAdvancedProfileItemTypes,
} from '@notify/interfaces';
import { controlsFromObject } from '../../../../services';
import { ConfirmModalFactory } from '../../../modals';
import { CHECKBOX_TOGGLE_EYE } from '../../../tailwind-forms/components/tailwind-checkbox/tailwind-checkbox.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  selector: 'notify-part-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  providers: [AdvancedProfileItemsService, ConfirmModalFactory],
  templateUrl: './part-settings.component.html',
})
export class PartSettingsComponent {
  private _apItemsSerivce = inject(AdvancedProfileItemsService);
  private _confirmModal = inject(ConfirmModalFactory);

  public showHiddenToggle = CHECKBOX_TOGGLE_EYE;
  public showHiddenToggleWithButton = {
    checked: `<button class="btn btn-outline btn-sm">${CHECKBOX_TOGGLE_EYE.checked}</button>`,
    unchecked: `<button class="btn btn-outline btn-sm">${CHECKBOX_TOGGLE_EYE.unchecked}</button>`,
  };

  @Input({ required: true }) form!: FormGroup<
    controlsFromObject<INotifyProfile['advancedProfile']>
  >;
  @Input() profile!: INotifyProfile;
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

  public get isRequired() {
    return this.requiredItems.includes(this.currentItem?.form.value._id || '');
  }

  public get requiredItems() {
    return Object.values(this.form.value?.requiredItems || {}).filter(
      (v) => v?.length
    ) as string[];
  }

  public deleteItem() {
    if (this.isRequired) {
      return;
    }

    const ref = this._confirmModal.create({
      value: true,
      title: 'Elimina elemento',
      description:
        'Sei sicuro di voler eliminare questo elemento? Questa azione è irreversibile.',
      cancelText: 'Annulla',
      confirmText: 'Elimina',
      confirmClass: this._confirmModal.deleteBtn,
      closeOnConfirm: true,
    });

    ref.instance.submitted.subscribe((result) => {
      if (!result) {
        return;
      }

      this.form.controls?.['items'].removeAt(
        this.form.controls['items'].controls.findIndex(
          (fg) => fg.controls._id.value === this.selectedHierarchyItem
        )
      );
    });
  }
}
