import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: ``,
})
export class SSRBaseComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  @Output() public componentStable = new EventEmitter<void>();
  @Output() public componentInit = new EventEmitter<void>();

  public get isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public componentInitialized() {
    return;
  }

  public ngOnInit(): void {
    this.componentInit.emit();
    this.componentInitialized();
  }

  public componentIsStable(): void {
    setTimeout(() => {
      this.componentStable.emit();
    }, 300);
  }

  public preloadImages(images: string[]): void {
    if (!this.isPlatformBrowser) {
      return;
    }
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }
}
