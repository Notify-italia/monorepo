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
  constructor(private elRef: ElementRef) {}

  @HostListener('click') onClick() {
    this.elRef.nativeElement.blur();
  }
}
