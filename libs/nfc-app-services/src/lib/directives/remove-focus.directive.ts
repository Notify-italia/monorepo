import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * This directive removes focus from the selectors after clicking on them
 */
@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[remove-focus]', // your selectors here!
})
export class RemoveFocusDirective {
  constructor(private elRef: ElementRef<HTMLButtonElement>) {}

  @HostListener('click') onClick() {
    if (this.elRef.nativeElement.hasAttribute('focus')) {
      this.elRef.nativeElement.blur();
      return;
    }

    this.elRef.nativeElement.focus();
  }
}
