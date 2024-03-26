import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class ModalBaseComponent {
  @Input({ required: true }) cf!: ComponentRef<ModalBaseComponent>;
  @Output() destroyed$ = new Subject<void>();
  /**
   * This method is called when the modal is closed. It should be overridden by the child component with its own logic.
   */
  public onClose(): void {
    return;
  }

  @HostListener('document:keydown.escape')
  close(config?: { skipLifecycle?: boolean }): void {
    if (!config?.skipLifecycle) {
      this.onClose();
    }
    this.cf.destroy();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
