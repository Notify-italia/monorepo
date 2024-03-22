import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: ``,
})
export class BasePageComponent {
  @Output() public componentStable = new EventEmitter<void>();
}
