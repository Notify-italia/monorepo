import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import { Observable, Subject, catchError, map, tap } from 'rxjs';
import { CachedSrcDirective } from '../directives';
import {
  INotifyShareItemConfig,
  ProfileFormComponent,
  ProfileViewComponent,
  ShareItemComponent,
} from '../modules';
import { ProfileShareSettingsFactory } from '../modules/profile/components/profile-share-settings/profile-share-settings.factory';
import { ITailwindSelectOption } from '../modules/tailwind-forms/components/tailwind-select/tailwind-select.component';
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
        (settingsClicked)="openShareSettings.emit(profile)"
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
        class="flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-around lg:space-x-4 space-y-4 lg:space-y-0 w-full h-full "
      >
        <div class="flex flex-col w-full 2xl:w-6/12 space-y-2">
          <button
            (click)="openShareSettings.emit(profile)"
            data-theme="notifytheme"
            class="btn btn-primary w-full group/customIdentifier relative text-white"
          >
            <div
              class="-translate-y-0 opacity-100 group-hover/customIdentifier:translate-y-4 group-hover/customIdentifier:opacity-0 smooth flex items-center justify-center  space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span> Personalizza l'URL di questo profilo</span>
            </div>
            <div
              class="-translate-y-4 opacity-0 group-hover/customIdentifier:translate-y-0 group-hover/customIdentifier:opacity-100 smooth absolute top-4 w-full justify-center flex items-center"
            >
              <span>{{ baseUrl }}/p/</span>
              <span class="text-white ">
                {{ profile.profileIdentifier || profile._id }}
              </span>
            </div>
          </button>
          <notify-profile-form
            [profile]="profile"
            [savedRedirects]="savedRedirects"
            [loading]="loading"
            (value)="updateProfileSubject.emit($event)"
            (submitForm)="saveProfile.emit($event)"
            (removeSavedRedirect)="removeSavedRedirect.emit($event)"
            [applyGoogleReviewLink$]="applyGoogleReviewLink$"
            (generateGoogleReviewLink)="generateGoogleReviewLink($event)"
            [notes]="notes"
            class="w-full"
          ></notify-profile-form>
        </div>
        <div
          class="lg:w-6/12  relative flex flex-col items-center relative"
          [ngClass]="profile.config.redirectEnabled ? 'h-fit' : 'max-h-max '"
        >
          @if (profile.config.redirectEnabled) {
          <div
            class="flex scale-90  lg:scale-75 2xl:scale-100 top-10 flex-col h-fit w-full"
            *ngIf="profile.config.redirectEnabled"
          >
            <iframe
              [cachedSrc]="normalizeURL(profile.redirectUrl)"
              class="iphone-15-pro phone mockup-phone pointer-events-none "
              frameborder="0"
            ></iframe>
            <small class="w-full text-center mx-auto">
              Alcuni siti web potrebbero non essere visualizzati correttamente
            </small>
          </div>
          } @else {
          <notify-profile-view
            *ngIf="!profile.config.redirectEnabled"
            [data]="profile"
            [mockup]="true"
            class="iphone-15-pro hidden lg:block  sticky scale-75 2xl:scale-100 -top-5 2xl:top-24"
          ></notify-profile-view>
          }
        </div>
      </div>

      <div
        class="fixed bottom-5 right-5 lg:hidden z-50"
        *ngIf="!profile.config.redirectEnabled"
      >
        <button
          class="floating-button"
          (click)="previewProfile.emit(profile)"
          [disabled]="loading"
        >
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
    ProfileShareSettingsFactory,
  ],
  standalone: true,
})
export class ProfileTemplateBaseComponent implements OnInit {
  private _utilsService = inject(UtilsService);

  @Input({ required: true }) profile$!: Observable<IProfile>;
  @Input({ required: true }) loading = false;
  @Input({ required: true }) baseUrl = '';
  @Input({ required: true }) savedRedirects: string[] = [];
  @Input({ required: true }) notes: ITailwindSelectOption[] = [];

  @Output() previewProfile = new EventEmitter<INotifyProfile>();
  @Output() saveProfile = new EventEmitter<INotifyProfile>();
  @Output() updateProfileSubject = new EventEmitter<INotifyProfile>();
  @Output() removeSavedRedirect = new EventEmitter<string>();
  @Output() openShareSettings = new EventEmitter<INotifyProfile>();
  @Output() applyGoogleReviewLink$ = new Subject<string>();

  public hidratedProfile$ = new Observable<
    IProfile & { shareConfig: INotifyShareItemConfig }
  >();

  ngOnInit() {
    this.hidratedProfile$ = this.profile$.pipe(
      map((profile) => ({
        ...profile,
        shareConfig: this._shareConfig(profile),
      }))
    );
  }

  public generateGoogleReviewLink(place: string) {
    return this._utilsService
      .getGooglePlaceId(place)
      .pipe(
        tap((placeId) => {
          this.applyGoogleReviewLink$.next(
            `https://search.google.com/local/writereview?placeid=${placeId.result}`
          );
        }),
        catchError((err) => this._utilsService.errorHandler(err, null))
      )
      .subscribe();
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
      id: profile.profileIdentifier || profile._id,
      baseUrl: this.baseUrl || '',
      isInModal: false,
      enableSettings: false,
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
