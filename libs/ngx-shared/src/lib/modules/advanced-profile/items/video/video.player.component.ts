import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { INotifyAPVideoItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemPlayerBaseImports,
  providers: AdvancedItemPlayerBaseProviders,
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div [class.pointer-events-none]="!context.getters.isRunningOnPlayer">
      <iframe
        class="w-full rounded-lg"
        [height]="currentItem.height"
        [src]="videoSrc"
        title="Embed videos and playlists"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; loop"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  `,
})
export class VideoPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPVideoItem> {
  public videoSrc!: SafeResourceUrl;

  override componentReady(): void {
    this.videoSrc = this.getVideoSrc();
    this.context.getters.componentChanged$.subscribe(() => {
      this.videoSrc = this.getVideoSrc();
    });
  }

  public getVideoSrc() {
    const videoId =
      (
        this.currentItem.source?.split('v=')[1] ||
        this.currentItem.source.split('/').pop()
      )
        ?.split('&')[0]
        ?.trim() || '';

    return this.context.services.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?playsinline=1&fs=0&autoplay=${
        this.currentItem.autoplay ? 1 : 0
      }${videoId ? `&playlist=${videoId}` : ''}&loop=${
        this.currentItem.loop ? 1 : 0
      }&mute=${this.currentItem.muted ? 1 : 0}&controls=${
        this.currentItem.controls ? 1 : 0
      }`
    );
  }
}
