import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: ``,
})
export class SSRBaseComponent implements OnInit {
  @Output() public componentStable = new EventEmitter<void>();
  @Output() public componentInit = new EventEmitter<void>();

  public ngOnInit(): void {
    this.componentInit.emit();
  }

  public componentIsStable(): void {
    this.componentStable.emit();
  }
}
