import { CommonModule } from '@angular/common';
import { Component, afterNextRender } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingComponent } from '@notify/ngx-shared';

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
        'https://s3-api.vps.notifyapp.it/assets/linee-guida-tessere.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=SQVS4ZMVI049HNSISI81%2F20240315%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240315T105356Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJTUVZTNFpNVkkwNDlITlNJU0k4MSIsImV4cCI6MTcxMDU0MzE1MywicGFyZW50Ijoibm90aWZ5LWFwaSJ9.qI9b2UJXyTzkHw8jk5GsViachcuDVy4dBll-ewS88akN8XuoxYRhA5YrP_dlrld4SxEkqs0bwrzG0htMilAEqw&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=5590d356df84c2f5a5daba39aa395f25cb54f23187abbfe1fb16545832925436'
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
