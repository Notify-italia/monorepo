import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';
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
import { PageFormComponent } from '../../items/page/page.form.component';
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
    PageFormComponent,
    IconSelectorComponent,
    ConfirmButtonComponent,
  ],
  providers: [AdvancedProfileItemsService, ConfirmModalFactory],
  templateUrl: './part-settings.component.html',
})
export class PartSettingsComponent implements OnChanges {
  private _apItemsSerivce = inject(AdvancedProfileItemsService);

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

  @Output() removeItem = new EventEmitter<string>();
  @Output() profileIdentifierChanged = new EventEmitter<string>();

  public settingsHostVisible = true;

  public get fontSizeSettings() {
    const conditionalFontSize =
      this.currentItem?.manifest.formOptions?.conditionalFontSize;

    const defaultValue = {
      label: 'Dimensione Testo',
      min: 0,
      max: 50,
      steps: 20,
      stepSuffix: 'px',
    };

    if (!conditionalFontSize?.length) {
      return defaultValue;
    }

    return (
      conditionalFontSize.filter((v) => v.condition(this.currentItem))?.[0] ||
      defaultValue
    );
  }

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
  public ngOnChanges(): void {
    this.settingsHostVisible = false;

    setTimeout(() => {
      this.settingsHostVisible = true;
    }, 1);
  }

  public setFont(font: string) {
    this.currentItem?.form.controls.textConfig.controls.font.setValue(font);
  }

  public deleteItem() {
    if (this.isRequired) {
      return;
    }

    this.removeItem.emit(this.currentItem?.form.value._id);
  }
}
