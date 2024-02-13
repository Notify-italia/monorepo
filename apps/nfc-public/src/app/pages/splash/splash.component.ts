import { CommonModule } from '@angular/common';
import {
  AfterRenderPhase,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { ProfileService, SSRDirective } from '@notify/nfc-app-services';
import { ProfileViewComponent } from '@notify/ngx-components';
import { dechroma } from 'dechroma';
import { Observable } from 'rxjs';

@Component({
  selector: 'notify-splash',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent, SSRDirective],
  providers: [ProfileService],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent {
  @ViewChild('SplashVideo') splashVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('SplashVideoCanvas') splashCanvas!: ElementRef<HTMLCanvasElement>;

  @Output() componentStable = new EventEmitter<void>();

  platformId = inject(PLATFORM_ID);

  public canvasSize = {
    width: 1080,
    height: 1080,
  };

  public isProfileReady = false;

  public demoProfile$!: Observable<INotifyProfile>;

  constructor(private _profileService: ProfileService) {
    afterNextRender(
      () => {
        this.demoProfile$ = this._profileService.getProfile(
          '655805c8f5638dc5ef4b3590'
        );

        this._chromaKeyVideo();

        this.componentStable.emit();
      },
      { phase: AfterRenderPhase.Read }
    );
  }

  private _chromaKeyVideo() {
    this.splashCanvas.nativeElement.width = this.canvasSize.width;
    this.splashCanvas.nativeElement.height = this.canvasSize.height;

    this.splashVideo.nativeElement.addEventListener('play', () => {
      CHROMA_KEY_VIDEO(this.splashVideo, this.splashCanvas, this.canvasSize);
    });
  }
}

const CHROMA_KEY_VIDEO = (
  splashVideo: ElementRef<HTMLVideoElement>,
  splashCanvas: ElementRef<HTMLCanvasElement>,
  size: {
    width: number;
    height: number;
  } = { width: 1440, height: 1440 }
) => {
  const nativeVideo = splashVideo?.nativeElement;

  const canvasContext = splashCanvas.nativeElement.getContext('2d', {
    willReadFrequently: true,
  });

  if (!canvasContext) {
    return;
  }

  canvasContext?.drawImage(nativeVideo, 0, 0, size.width, size.height);

  const frame = canvasContext.getImageData(0, 0, size.width, size.height);

  // rgba(29, 36, 39, 1)
  // Remove green screen
  dechroma(frame, [21, 29], [31, 36], [31, 39]);

  canvasContext.putImageData(frame, 0, 0);

  window.requestAnimationFrame(() =>
    CHROMA_KEY_VIDEO(splashVideo, splashCanvas, size)
  );
};
