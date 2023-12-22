import { CommonModule } from '@angular/common';
import { Component, ComponentRef, HostListener, Input } from '@angular/core';
import { Subject } from 'rxjs';

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
export class ConfirmComponent {
  @Input({ required: true }) public config!: IConfirmModalConfig;
  @Input() public loading = false;
  @Input({ required: true }) public cf!: ComponentRef<ConfirmComponent>;

  public submitted = new Subject<IConfirmModalConfig['value']>();

  public destroyed$ = new Subject<void>();

  @HostListener('document:keydown.escape', ['$event'])
  public close() {
    this.submitted.next(null);
    this.cf.destroy();
    this.destroyed$.next();
  }

  public confirm() {
    this.submitted.next(this.config.value);

    if (this.config.closeOnConfirm) {
      this.cf.destroy();
      this.destroyed$.next();
    }
  }
}
