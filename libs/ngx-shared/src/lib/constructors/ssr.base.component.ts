import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: ``,
})
export class SSRBaseComponent {
  @Output() public componentStable = new EventEmitter<void>();

  public componentIsStable(): void {
    console.log(`Component is stable.`);
    this.componentStable.emit();
  }
}
