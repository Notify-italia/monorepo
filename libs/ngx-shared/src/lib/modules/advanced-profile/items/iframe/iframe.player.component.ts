import { Component } from '@angular/core';
import { INotifyAPIFrameItem } from '@notify/interfaces';
import { OgObject } from 'open-graph-scraper/types/lib/types';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { IFrameModalNavbarStyle, iframeFactory } from '../../../modals';

@Component({
  standalone: true,
  imports: [...AdvancedItemPlayerBaseImports],
  providers: [...AdvancedItemPlayerBaseProviders, iframeFactory],
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      <button
        class="flex space-x-2 items-center justify-evenly  rounded-xl  text-start p-2 pr-4 w-full h-32 active:scale-95 smooth smooth-fast"
        ontouchstart
        (click)="handleClick()"
        [ngClass]="{
          'flex-col h-full !space-x-0 space-y-2 !pr-2': context.getters.currentItem.direction === 'vertical',
        }"
        [ngStyle]="{
          'background-color': context.getters.textColor,
          color: ogMetadataTextColor
        }"
      >
        @if(openGraphMetadata) {
        <img
          *ngIf="imageUrl"
          [src]="imageUrl"
          class=" w-24 h-24 rounded-lg object-cover shrink-0"
          [ngClass]="{
          'w-full h-32 ': context.getters.currentItem.direction === 'vertical',
        }"
        />

        <div
          class="max-w-full truncate max-h-full w-full"
          [ngClass]="{
            'text-left': !imageUrl
          }"
        >
          <p class="truncate">
            <small>
              <strong>{{ ogTitle }}</strong>
            </small>
          </p>

          <p class=" whitespace-normal max-h-20 leading-tight line-clamp-3">
            <small>
              <small>
                {{ ogDescription || this.openGraphMetadata.requestUrl }}
              </small>
            </small>
          </p>
        </div>

        <div
          class="dropdown text-sm dropdown-left dropdown-bottom w-full"
          (click)="$event.stopPropagation()"
        >
          <div
            tabindex="0"
            role="button"
            [ngClass]="{
          'flex w-full justify-end': context.getters.currentItem.direction === 'vertical',
        }"
          >
            <svg
              *ngIf="context.getters.currentItem.direction === 'vertical'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 rotate-180"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>

            <svg
              *ngIf="context.getters.currentItem.direction === 'horizontal'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu-xs p-2 rounded-lg w-52 shadow-md text-xs gap-5"
            [ngStyle]="{
              'background-color': context.services.utils.changeColorBrightness(
                context.getters.textColor,
                95
              ),
              color: context.services.utils.getContrastingColor(
                context.getters.textColor
              )
            }"
          >
            <li class="py-2 pr-2 text-end" (click)="handleClick()">Apri</li>
            <li class="py-2 pr-2 text-end" (click)="handleClick(true)">
              Apri in un'altra tab
            </li>
            <li class="py-2 pr-2 text-end" (click)="shareLink()">Condividi</li>
          </ul>
        </div>

        } @else {
        <div class="flex justify-center w-full">
          <notify-loading></notify-loading>
        </div>
        }
      </button>
    </div>
  `,
})
export class IFramePlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPIFrameItem> {
  public openGraphMetadata?: OgObject;
  public get currentUrl() {
    const url = this.context.getters.currentItem.url;

    if (!url) {
      return '';
    }

    const normalized = this.context.services.utils.populateWebProtocol(
      'https://',
      url
    );

    if (!this.context.services.utils.isValidUrl(normalized)) {
      return '';
    }

    return normalized;
  }

  public get ogTitle() {
    if (this.openGraphMetadata?.charset?.toLowerCase() === 'utf-8') {
      return this.openGraphMetadata?.ogTitle || '';
    }

    return convertToUTF8(
      this.openGraphMetadata?.ogTitle || ''
      // this.openGraphMetadata?.charset
    );
  }

  public get ogDescription() {
    if (this.openGraphMetadata?.charset === 'utf-8') {
      return this.openGraphMetadata?.ogDescription || '';
    }

    return convertToUTF8(
      this.openGraphMetadata?.ogDescription || ''
      // this.openGraphMetadata?.charset
    );
  }

  public get ogMetadataTextColor() {
    return this.context.services.utils.getContrastingColor(
      this.context.getters.textColor || '#000000'
    );
  }

  public get imageUrl() {
    if (!this.openGraphMetadata) {
      return;
      ('');
    }
    const { ogImage, ogUrl } = this.openGraphMetadata;

    const mainImage = ogImage?.[0];

    if (!mainImage) {
      return;
    }

    if (mainImage?.url.includes('https://')) {
      return mainImage?.url;
    }

    return (ogUrl || '') + (mainImage?.url || '');
  }

  public async shareLink() {
    if (!navigator.share) {
      await navigator.clipboard.writeText(this.currentUrl);
      this.context.services.toastr.info('URL del sito web copiato');
      return;
    }
    try {
      return await navigator.share({
        url: this.currentUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  public handleClick(openInNewWindow = false) {
    if (!this.context.getters.currentItem.openInNotify || openInNewWindow) {
      window.open(this.currentUrl, openInNewWindow ? '_blank' : '_self');
      return;
    }

    this.context.emitters.itemEvent<{
      url: string;
      title: string;
      navbarStyle: IFrameModalNavbarStyle;
    }>(
      {
        url: this.currentUrl,
        title:
          this.openGraphMetadata?.ogTitle ||
          this.openGraphMetadata?.requestUrl ||
          '',
        navbarStyle: {
          backgroundColor: this.context.getters.textColor,
          color: this.ogMetadataTextColor,
        },
      },
      'CREATE_IFRAME_MODAL'
    );
  }

  public override componentReady(): void {
    this._getOpenGraphMetadata().subscribe();

    this.context.getters.componentChanged$
      .pipe(
        debounceTime(1000),
        switchMap(() => this._getOpenGraphMetadata())
      )
      .subscribe();
  }

  private _getOpenGraphMetadata() {
    if (!this.currentUrl) {
      this.openGraphMetadata = undefined;
      return of();
    }

    return this.context.services.utils
      .getOpenGraphMetadata(this.currentUrl)
      .pipe(
        tap((data) => {
          if (data.error) {
            return;
          }

          this.openGraphMetadata = {
            ...data.result,
          };
        }),
        catchError(() => {
          this.openGraphMetadata = undefined;
          return of();
        })
      );
  }
}

export const convertToUTF8 = (body: string) => {
  try {
    return decodeURIComponent(escape(body));
  } catch {
    return body;
  }
};
