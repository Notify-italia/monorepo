import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { CapacitorService } from '../services';

export const baseModalComponentProviders = [CapacitorService];

export interface IBaseModalOptions {
  showStatusBar?: boolean;
}

@Component({
  template: '',
})
export class ModalBaseComponent<Submitted = UnknownType> implements OnInit {
  public _capacitorService = inject(CapacitorService);

  @Input({ required: true }) cf!: ComponentRef<ModalBaseComponent>;
  @Input() baseModalOptions?: IBaseModalOptions;
  @Input() isClosing = false;

  @Output() destroyed$ = new Subject<void>();

  public submitted = new Subject<Submitted>();

  public get parentElement() {
    return (this.cf.location.nativeElement as HTMLElement)
      .parentElement as HTMLElement;
  }

  public ngOnInit() {
    if (!this.baseModalOptions?.showStatusBar) {
      this._capacitorService.setStatusbarVisibility(false);
    }

    this.onInit();
  }

  public onInit(): void {
    return;
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
      }, config?.timeout || 200)
    );
  }
}
