import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="h-screen w-screen ">
      <notify-loading></notify-loading>
    </div>
  `,
})
export class RedirectComponent {
  pdfUrl: SafeResourceUrl | null =
    this._domSanitizer.bypassSecurityTrustResourceUrl('');

  constructor(
    private _router: Router,
    private _domSanitizer: DomSanitizer,
    private _route: ActivatedRoute
  ) {
    afterNextRender(() => {
      this.loadPdf(this._route.snapshot.data['assetUrl']);
    });
  }

  loadPdf(path: string) {
    const link = document.createElement('a');
    link.href = path;
    link.download = path;
    link.click();

    this._router.navigate(['/']);
  }
}
