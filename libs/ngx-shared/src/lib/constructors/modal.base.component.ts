import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class ModalBaseComponent<Submitted = UnknownType> {
  @Input({ required: true }) cf!: ComponentRef<ModalBaseComponent>;
  @Output() destroyed$ = new Subject<void>();

  public isClosing = false;
  public submitted = new Subject<Submitted>();

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
        this.cf.destroy();
        this.destroyed$.next();
        this.destroyed$.complete();
        resolve(void 0);
      }, config?.timeout || 1)
    );
  }
}
