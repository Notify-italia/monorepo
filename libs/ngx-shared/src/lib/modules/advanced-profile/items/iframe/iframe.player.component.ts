import { Component } from '@angular/core';
import { INotifyAPIFrameItem } from '@notify/interfaces';
import { OgObject } from 'open-graph-scraper/dist/lib/types';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { CachedSrcDirective } from '../../../../directives';
import { IFrameModalNavbarStyle, iframeFactory } from '../../../modals';

@Component({
  standalone: true,
  imports: [...AdvancedItemPlayerBaseImports, CachedSrcDirective],
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
        [ngStyle]="{
          'background-color': context.getters.textColor,
          color: ogMetadataTextColor
        }"
      >
        @if(openGraphMetadata) {
        <img
          [src]="imageUrl"
          class=" w-24 h-24 rounded-lg object-cover shrink-0"
          *ngIf="imageUrl"
        />

        <div
          class="max-w-full truncate max-h-full"
          [ngClass]="{
            'text-center': !imageUrl
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

        <div class="dropdown">
          <div tabindex="0" role="button" class=" m-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
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
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
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
    return this.context.services.utils.getContrstingColor(
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

  public handleClick() {
    if (!this.context.getters.currentItem.openInNotify) {
      window.open(this.currentUrl, '_blank');
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
