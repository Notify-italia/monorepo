import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalBaseComponent } from '../../../constructors';
import {
  EnumSelectOptionStyle,
  ISelectOption,
  SelectComponent,
} from '../select/select.component';

export interface IConfirmModalConfig {
  value: unknown;
  title: string;
  description: string;
  cancelText?: string;
  confirmText: string;
  confirmClass?: string;
  confirmStyle?: EnumSelectOptionStyle;
  closeOnConfirm?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, SelectComponent],
  styleUrls: ['./confirm.component.scss'],
  template: `<notify-select
    [cf]="cf"
    [title]="config.title"
    [subtitle]="config.description"
    [options]="options"
    [hideCancel]="true"
  ></notify-select>`,
})
export class ConfirmComponent extends ModalBaseComponent {
  @Input({ required: true }) public config!: IConfirmModalConfig;
  @Input() public loading = false;

  override onClose() {
    this.submitted.next(null);
  }

  public confirm() {
    this.submitted.next(this.config.value);

    if (this.config.closeOnConfirm) {
      this.close({
        skipLifecycle: true,
      });
    }
  }

  public get options(): ISelectOption[] {
    return [
      {
        label: this.config.confirmText || 'Conferma',
        value: true,
        style: this.config.confirmStyle,
      },
      {
        label: this.config.cancelText || 'Annulla',
        value: false,
        style: EnumSelectOptionStyle.CANCEL,
      },
    ];
  }
}
