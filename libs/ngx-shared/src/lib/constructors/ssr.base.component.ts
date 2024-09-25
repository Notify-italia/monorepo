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

  public componentInitialized() {
    return;
  }

  public ngOnInit(): void {
    this.componentInit.emit();
    this.componentInitialized();
  }

  public componentIsStable(): void {
    this.componentStable.emit();
  }
}
