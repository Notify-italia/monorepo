import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  INotifyProfile,
  NotifyAdvancedProfileItemTypes,
} from '@notify/interfaces';
import { ConfirmButtonComponent } from '../../../../standalones/confirm-button/confirm-button.component';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { ConfirmModalFactory } from '../../../modals';
import { CHECKBOX_TOGGLE_EYE } from '../../../tailwind-forms/components/tailwind-checkbox/tailwind-checkbox.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { BackgroundFormComponent } from '../../items/background/background.form.component';
import {
  AdvancedProfileItemsService,
  advancedProfileForm,
} from '../../services/advanced-profile-items.service';
import { FONTS_ICON_SET } from '../../services/fonts.iconset';

@Component({
  selector: 'notify-part-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TailwindFormsModule,
    BackgroundFormComponent,
    IconSelectorComponent,
    ConfirmButtonComponent,
  ],
  providers: [AdvancedProfileItemsService, ConfirmModalFactory],
  templateUrl: './part-settings.component.html',
})
export class PartSettingsComponent {
  private _apItemsSerivce = inject(AdvancedProfileItemsService);
  private _confirmModal = inject(ConfirmModalFactory);

  public showHiddenToggle = CHECKBOX_TOGGLE_EYE;
  public showHiddenToggleWithButton = {
    checked: CHECKBOX_TOGGLE_EYE.checked,
    unchecked: CHECKBOX_TOGGLE_EYE.unchecked,
    button: `btn btn-sm bg-[#191C21] rounded-xl`,
  };
  public fontsIconSet = FONTS_ICON_SET;

  @Input({ required: true }) form!: advancedProfileForm;
  @Input() profile!: INotifyProfile;
  @Input() selectedHierarchyItem = 'background';
  @Input() environment!: Record<string, unknown>;

  public get currentItem() {
    const form = this.form.controls?.['items'].controls?.find(
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

  public setFont(font: string) {
    this.currentItem?.form.controls.textConfig.controls.font.setValue(font);
  }

  public deleteItem() {
    if (this.isRequired) {
      return;
    }
    this.form.controls?.['items'].removeAt(
      this.form.controls['items'].controls.findIndex(
        (fg) => fg.controls._id.value === this.selectedHierarchyItem
      )
    );
  }
}
