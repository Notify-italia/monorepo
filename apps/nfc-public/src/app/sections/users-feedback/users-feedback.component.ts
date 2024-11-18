import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { SSRBaseComponent, UtilsService } from '@notify/ngx-shared';

@Component({
  selector: 'notify-users-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-feedback.component.html',
  styleUrl: './users-feedback.component.scss',
})
export class UsersFeedbackComponent
  extends SSRBaseComponent
  implements AfterViewInit
{
  private _utilsSerivce = inject(UtilsService);
  @ViewChild('ProofVideo') video!: ElementRef<HTMLVideoElement>;

  public get videoUrl() {
    return this._utilsSerivce.isMobile
      ? 'https://s3-api.vps.notifyapp.it/assets/notify-proof-mobile.webm'
      : 'https://s3-api.vps.notifyapp.it/assets/notify-proof-desktop.webm';
  }

  constructor() {
    super();

    this.preloadImages([
      '/assets/users-feedback/outfitter.webp',
      '/assets/users-feedback/instagram.webp',
      '/assets/users-feedback/google.webp',
    ]);
  }

  ngAfterViewInit() {
    if (!this.isPlatformBrowser) {
      return;
    }
    this.video.nativeElement.src = this.videoUrl;
    this.video.nativeElement.load();
  }
}
