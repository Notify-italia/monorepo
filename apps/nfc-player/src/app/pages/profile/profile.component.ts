import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EnumNotifyProfileSources,
  EnumNotifyStatType,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
import {
  GesturesDirective,
  ProfileService,
  SocketService,
  StatService,
  UtilsService,
} from '@notify/nfc-app-services';
import {
  FeedbackFactory,
  FileRecievedFactory,
  LoadingComponent,
  ProfileViewComponent,
  SwipeAvailableComponent,
  defaultGradientStops,
} from '@notify/ngx-components';
import {
  Observable,
  Subject,
  catchError,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'notify-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    GesturesDirective,
    SwipeAvailableComponent,
    LoadingComponent,
  ],
  providers: [FileRecievedFactory, StatService, FeedbackFactory, UtilsService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public profile$: Observable<INotifyProfile>;
  public publicUrl = environment.publicUrl;
  public feedbackKey = environment.feedbackKey;

  private _thresholds = {
    minScale: 0.9,
    maxScale: 1,
    minTranslate: 0,
    maxTranslate: 100,
    //the higher the number, the less the user has to swipe to show/hide the company profile
    horizontalSwipe: 70,
  };

  public profileScale = this._thresholds.maxScale;
  public companyProfileX = this._thresholds.maxTranslate;
  public companyIsVisible = false;
  public profileColors?: INotifyProfile['colors'];

  private _destroy$ = new Subject<void>();

  public get socketId(): string {
    return this._socket.user?.id || '';
  }

  public get currentBreakpoint() {
    return this._utils.currentTailwindMediaQuery();
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _profileService: ProfileService,
    private _titleService: Title,
    private _router: Router,
    private _socket: SocketService,
    private _fileRecieved: FileRecievedFactory,
    private _Meta: Meta,
    private _statService: StatService,
    private _feedbackFactory: FeedbackFactory,
    private _utils: UtilsService
  ) {
    this.profile$ = this._profileService
      .getProfile(
        this._activatedRoute.snapshot.queryParamMap.get('p') as string
      )
      .pipe(
        tap((profile) =>
          this._statService
            .incrementStat(this._getStatTypeFromOrigin(), profile.owner)
            .pipe(tap(() => this._removeQueryParam()))
            .subscribe()
        ),
        switchMap((p) => {
          if (!p.config.redirectEnabled) {
            return of(p);
          }
          this._redirect(p);

          return of(null as unknown as INotifyProfile);
        }),
        tap((profile) => {
          if (!profile) {
            return;
          }

          this._setMeta(profile);
          this.profileColors = profile.colors;
          this._socket.connect(profile._id);
        }),
        catchError((err) => {
          this._router.navigate(['/404']);
          throw new Error(err);
        })
      );
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
    this._socket.disconnect();
    this._destroy$.next();
    this._destroy$.complete();
  }

  public ngOnInit() {
    this._socket.fileRecieved$
      .pipe(
        takeUntil(this._destroy$),
        tap((file) => {
          this._fileRecieved.create(
            file,
            this.profileColors as INotifyProfile['colors']
          );
        })
      )
      .subscribe();
  }

  public isAgent(profile: INotifyProfile): boolean {
    return profile.type === EnumNotifyUserType.Agent;
  }

  public handleHorizontalSwipe($event: number, profile: INotifyProfile) {
    if (!this.isAgent(profile)) {
      return;
    }

    let normalizedValue = 100 + $event;

    if (this.companyIsVisible) {
      normalizedValue = $event;
    }

    if (normalizedValue < this._thresholds.minTranslate) {
      normalizedValue = 0;
    }

    if (normalizedValue > this._thresholds.maxTranslate) {
      this.companyProfileX = 100;
      this.profileScale = 1;
      return;
    }

    this.companyProfileX = normalizedValue;

    this._handleScaleChange($event);
  }

  public handleIntegrationClicked(
    $event: INotifyProfile['customFields'][0],
    profile: INotifyProfile
  ) {
    this._statService
      .incrementStatCounter(
        EnumNotifyStatType.ProfileIntegrationCount.replace(
          '{{integration}}',
          $event.iconName
        ),
        profile.owner,
        this.isAgent(profile)
          ? EnumNotifyUserType.Agent
          : EnumNotifyUserType.Company
      )
      .subscribe();
  }

  public showFeedback(profile: INotifyProfile): void {
    this._feedbackFactory.create({
      profile,
      feedbackKey: this.feedbackKey,
    });
  }

  public handleTouchEnd() {
    const _hThreshold = this.companyIsVisible
      ? 100 - this._thresholds.horizontalSwipe
      : this._thresholds.horizontalSwipe;

    if (this.companyProfileX < _hThreshold) {
      this.companyProfileX = 0;
      this.profileScale = this._thresholds.minScale;
      this.companyIsVisible = true;
      return;
    }

    this.companyIsVisible = false;
    this.companyProfileX = 100;
    this.profileScale = this._thresholds.maxScale;
  }

  private _handleScaleChange($event: number) {
    //decrease the scale until it reaches the minimum threshold if the company profile is not visible
    if (!this.companyIsVisible) {
      this.profileScale =
        this._thresholds.minScale +
        (this._thresholds.maxScale - this._thresholds.minScale) *
          (this._thresholds.maxScale - Math.abs($event) / 100);

      return;
    }

    //increse the scale until it reaches the maximum threshold if the company profile is visible
    this.profileScale =
      this._thresholds.minScale +
      (this._thresholds.maxScale - this._thresholds.minScale) *
        (Math.abs($event) / 100);
  }

  public forceShowCompanyProfile(): void {
    this.companyIsVisible = true;

    this.profileScale = this._thresholds.minScale;

    if (this.companyProfileX <= this._thresholds.minTranslate) {
      return;
    }

    setTimeout(() => {
      this.companyProfileX -= 2;
      this.forceShowCompanyProfile();
    }, 1);
  }

  public forceHideCompanyProfile(): void {
    this.companyIsVisible = false;

    this.profileScale = this._thresholds.maxScale;

    if (this.companyProfileX >= this._thresholds.maxTranslate) {
      return;
    }

    setTimeout(() => {
      this.companyProfileX += 2;
      this.forceHideCompanyProfile();
    }, 1);
  }

  public saveContact(d: INotifyProfile): void {
    this._profileService.saveContact(d, this.publicUrl);

    this._statService
      .incrementStat(EnumNotifyStatType.ProfileSave, d.owner)
      .subscribe();
  }

  private _getStatTypeFromOrigin() {
    const source = this._activatedRoute.snapshot.queryParamMap.get(
      's'
    ) as EnumNotifyProfileSources;

    switch (source) {
      case EnumNotifyProfileSources.Contacts:
        return EnumNotifyStatType.ProfileReturn;

      default:
        return EnumNotifyStatType.ProfileVisit;
    }
  }

  private _removeQueryParam() {
    const url = new URL(window.location.href);
    url.searchParams.delete('s');
    const newUrl = url.toString();
    window.history.replaceState({}, '', newUrl);
  }

  private _redirect(profile: INotifyProfile) {
    if (this._getStatTypeFromOrigin() === EnumNotifyStatType.ProfileReturn) {
      return;
    }

    if (!profile.redirectUrl || !profile.config.redirectEnabled) {
      return;
    }

    //create an "a" element to redirect the user to the redirect url
    const a = document.createElement('a');
    a.id = 'redirectToURL';
    a.classList.add('hidden');
    a.href = this._utils.populateWebProtocol('https://', profile.redirectUrl);
    // a.target = '_blank';

    //click the "a" element
    a.click();
  }

  private _setMeta(profile: INotifyProfile) {
    const descriptionMessage = this.isAgent(profile)
      ? `Visualizza ${profile.name} ${profile.surname} di ${profile.company?.name} via Notify!`
      : `Visualizza ${profile.name} via Notify!`;

    const topThemeColor =
      profile.colors.background[0] || defaultGradientStops[0];

    this._titleService.setTitle(`${profile.name || 'Ignoto'} - Notify`);

    this._Meta.updateTag({
      name: 'description',
      content: descriptionMessage,
    });

    this._Meta.updateTag({
      name: 'og:title',
      content: `${profile.name} ${profile.surname}`,
    });

    this._Meta.updateTag({
      name: 'og:description',
      content: descriptionMessage,
    });

    this._Meta.updateTag({
      name: 'og:image',
      content: profile.avatar || '',
    });

    //edit the theme color of the browser
    this._Meta.updateTag({
      name: 'theme-color',
      content: topThemeColor,
    });

    //edit the color of the browser bar on mobile
    this._Meta.updateTag({
      name: 'msapplication-navbutton-color',
      content: topThemeColor,
    });

    //edit the color of the browser bar on mobile
    this._Meta.updateTag({
      name: 'apple-mobile-web-app-status-bar-style',
      content: topThemeColor,
    });

    this._Meta.updateTag({
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    });

    //edit the color of the browser bar on mobile
    this._Meta.updateTag({
      name: 'msapplication-TileColor',
      content: topThemeColor,
    });
  }
}
