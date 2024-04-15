import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { Observable, map } from 'rxjs';
import { CachedSrcDirective } from '../directives';
import {
  INotifyShareItemConfig,
  ProfileFormComponent,
  ProfileViewComponent,
  ShareItemComponent,
} from '../modules';
import { CapacitorService, UtilsService } from '../services';
import { LoadingComponent, SaveIndicatorComponent } from '../standalones';

type IProfile = INotifyProfile;

@Component({
  selector: 'notify-profile-management-template-base',
  template: `
    <div class="space-y-4">
      @if (hidratedProfile$ | async; as profile) {

      <notify-share-item
        [config]="profile.shareConfig"
        source="root"
      ></notify-share-item>

      <notify-save-indicator
        [followPage]="true"
        [isSaving]="loading"
        [lastSave]="profile.updatedAt"
        (save)="saveProfile.emit(profile)"
      ></notify-save-indicator>

      <div class="divider"></div>

      <div
        class="lg:flex justify-around lg:space-x-4 space-y-4 lg:space-y-0 items-start w-full"
      >
        <notify-profile-form
          [profile]="profile"
          [savedRedirects]="savedRedirects"
          [loading]="loading"
          (value)="updateProfileSubject.emit($event)"
          (submitForm)="saveProfile.emit($event)"
          (removeSavedRedirect)="removeSavedRedirect.emit($event)"
          class="w-full 2xl:w-6/12"
        ></notify-profile-form>

        <div class="w-6/12 p-2 flex justify-center relative">
          <notify-profile-view
            *ngIf="!profile.config.redirectEnabled"
            [data]="profile"
            [mockup]="true"
            class="iphone-15-pro hidden lg:block absolute scale-75 2xl:scale-100 top-10"
          ></notify-profile-view>

          <div
            class="hidden lg:flex absolute scale-75 2xl:scale-100 top-10 flex-col"
            *ngIf="profile.config.redirectEnabled"
          >
            <iframe
              [cachedSrc]="normalizeURL(profile.redirectUrl)"
              class="iphone-15-pro phone mockup-phone pointer-events-none"
              frameborder="0"
            ></iframe>
            <small class="w-full text-center mx-auto">
              Alcuni siti web potrebbero non essere visualizzati correttamente
            </small>
          </div>
        </div>
      </div>

      <div
        class="fixed bottom-5 right-5 lg:hidden z-50"
        *ngIf="!profile.config.redirectEnabled"
      >
        <button class="floating-button" (click)="previewProfile.emit(profile)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      } @else {
      <div class="loading-container">
        <notify-loading></notify-loading>
      </div>
      }
    </div>
  `,
  imports: [
    CommonModule,
    LoadingComponent,
    CachedSrcDirective,
    ProfileViewComponent,
    ProfileFormComponent,
    ShareItemComponent,
    SaveIndicatorComponent,
  ],
  providers: [
    UtilsService,
    //per qualche ragione vuole per forza il provide di CapacitorService
    CapacitorService,
  ],
  standalone: true,
})
export class ProfileTemplateBaseComponent implements OnInit {
  @Input({ required: true }) profile$!: Observable<IProfile>;
  @Input({ required: true }) loading = false;
  @Input({ required: true }) baseUrl = '';
  @Input({ required: true }) savedRedirects: string[] = [];

  @Output() previewProfile = new EventEmitter<INotifyProfile>();
  @Output() saveProfile = new EventEmitter<INotifyProfile>();
  @Output() updateProfileSubject = new EventEmitter<INotifyProfile>();
  @Output() removeSavedRedirect = new EventEmitter<string>();

  public hidratedProfile$ = new Observable<
    IProfile & { shareConfig: INotifyShareItemConfig }
  >();

  constructor(private _utilsService: UtilsService) {}

  ngOnInit() {
    this.hidratedProfile$ = this.profile$.pipe(
      map((profile) => ({
        ...profile,
        shareConfig: this._shareConfig(profile),
      }))
    );
  }

  public normalizeURL(url: string | null) {
    if (!url) {
      url = 'https://notifyapp.it';
    }

    return this._utilsService.populateWebProtocol('https://', url);
  }

  private _shareConfig(profile: INotifyProfile): INotifyShareItemConfig {
    const companyNfcItem = profile.company
      ? [
          {
            value: profile.company._id,
            label: 'Profilo Aziendale',
          },
        ]
      : [];

    return {
      type: 'profile',
      id: profile._id,
      baseUrl: this.baseUrl || '',
      isInModal: true,
      qrcode: {
        title: 'Condividi il profilo',
        fileName: profile.name || 'Profilo',
      },
      nfc: {
        items: [
          {
            value: profile._id,
            label: 'Questo Profilo',
          },
          ...companyNfcItem,
        ],
      },
    };
  }
}
