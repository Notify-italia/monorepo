import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { CapacitorService } from '../services';

export const baseModalComponentProviders = [CapacitorService];

@Component({
  template: '',
})
export class ModalBaseComponent<Submitted = UnknownType> {
  public _capacitorService = inject(CapacitorService);
  @Input({ required: true }) cf!: ComponentRef<ModalBaseComponent>;
  @Output() destroyed$ = new Subject<void>();

  @Input() isClosing = false;
  public submitted = new Subject<Submitted>();

  constructor() {
    this._capacitorService.setStatusbarVisibility(false);
  }

  /**
   * This method is called when the modal is closed. It should be overridden by the child component with its own logic.
   */
  public onClose(): void {
    return;
  }

  @HostListener('document:keydown.escape')
  async close(config?: { skipLifecycle?: boolean; timeout?: number }) {
    this.isClosing = true;

    new Promise((resolve) =>
      setTimeout(() => {
        if (!config?.skipLifecycle) {
          this.onClose();
        }
        this._capacitorService.setStatusbarVisibility(true);
        this.cf.destroy();
        this.destroyed$.next();
        this.destroyed$.complete();
        this.submitted.complete();
        resolve(void 0);
      }, config?.timeout || 1)
    );
  }
}
