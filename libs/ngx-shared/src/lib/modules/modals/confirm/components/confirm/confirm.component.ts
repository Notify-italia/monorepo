import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalBaseComponent } from '../../../../../constructors/modal.base.component';

export interface IConfirmModalConfig {
  value: unknown;
  title: string;
  description: string;
  cancelText?: string;
  confirmText: string;
  confirmClass?: string;
  closeOnConfirm?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent extends ModalBaseComponent {
  @Input({ required: true }) public config!: IConfirmModalConfig;
  @Input() public loading = false;

  public submitted = new Subject<IConfirmModalConfig['value']>();

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
}
