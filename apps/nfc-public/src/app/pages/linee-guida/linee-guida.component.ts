import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingComponent } from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="h-screen w-screen">
      <notify-loading></notify-loading>
    </div>
  `,
})
export class LineeGuidaComponent {
  pdfUrl: SafeResourceUrl | null =
    this._domSanitizer.bypassSecurityTrustResourceUrl('');

  constructor(private _router: Router, private _domSanitizer: DomSanitizer) {
    afterNextRender(() => {
      this.loadPdf(
        'https://drive.usercontent.google.com/download?id=19gLlFEDmMvF-G4qA-0JTz5DLNjFbr6OY&export=download&authuser=0'
      );
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
