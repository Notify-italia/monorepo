import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LoadingComponent,
  PageHeaderComponent,
  ProfileFormComponent,
  ProfilePlayerFactory,
  ProfileViewComponent,
  SaveIndicatorComponent,
  ShareProfileComponent,
} from '@notify/ngx-shared';

import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AppError,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
import {
  AuthService,
  CapacitorService,
  CompanyService,
  ProfileService,
  UtilsService,
} from '@notify/nfc-app-services';
import { Observable, Subject, catchError, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

type IProfile = INotifyProfile<EnumNotifyUserType.Agent>;

@Component({
  selector: 'notify-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    ProfileFormComponent,
    ProfileViewComponent,
    ShareProfileComponent,
    PageHeaderComponent,
    LoadingComponent,
    RouterLink,
    SaveIndicatorComponent,
  ],
  providers: [
    ProfilePlayerFactory,
    CapacitorService,
    UtilsService,
    CompanyService,
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  private _profileSubject$ = new Subject<IProfile>();
  public profile$: Observable<IProfile> = this._profileSubject$;

  public baseUrl = environment.profilesUrl;
  public loading = false;
  public providedProfile =
    this._activatedRoute.snapshot.queryParamMap.get('p') || undefined;

  public get savedRedirects() {
    return this._authService.user?.savedRedirects || [];
  }

  constructor(
    private _profileService: ProfileService,
    private _utilsService: UtilsService,
    private _playerFactroy: ProfilePlayerFactory,
    private _authService: AuthService,
    private _companyService: CompanyService,
    private _domSanitizer: DomSanitizer,
    private _activatedRoute: ActivatedRoute
  ) {
    this._getProfile();

    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['p'] !== this.providedProfile) {
        //? questo è un workaround per forzare il refresh della pagina quando cambia il parametro p nella query string
        //TODO spostare tutta la logica di update del profilo di un agente da una company in un altro componente e tornare a questo se non è presente il parametro p
        location.reload();
      }
    });
  }

  public updateProfileSubject(profile: INotifyProfile) {
    this._profileSubject$.next(profile as IProfile);
  }

  public previewProfile(profile: INotifyProfile) {
    this._playerFactroy.createPlayer({ profile });
  }

  public saveProfile(profile: IProfile) {
    this.loading = true;
    this._profileService
      .patchProfile(profile, this.providedProfile)
      .pipe(
        tap((profile) => this._profileSubject$.next(profile)),
        switchMap((p) => {
          if (!this._authService.user) {
            return of();
          }

          const savedRedirects: string[] = [
            ...new Set([
              ...(this._authService.user?.savedRedirects || []),
              p.redirectUrl || '',
            ]),
          ].filter((r) => r);

          return this._companyService
            .patchCompany({
              savedRedirects,
            })
            .pipe(switchMap(() => this._authService.refreshToken()));
        }),
        catchError(async (err: AppError) =>
          this._utilsService.errorHandler(err)
        ),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }

  public normalizeURL(url: string | null) {
    if (!url) {
      url = 'https://notifyapp.it';
    }

    return this._domSanitizer.bypassSecurityTrustResourceUrl(
      this._utilsService.populateWebProtocol('https://', url)
    );
  }

  public removeSavedRedirect(redirect: string) {
    this.loading = true;

    this._companyService
      .patchCompany({
        savedRedirects: this.savedRedirects.filter((r) => r !== redirect),
      })
      .pipe(
        switchMap(() => {
          return this._authService.refreshToken();
        }),
        catchError(async (err: AppError) => {
          return this._utilsService.errorHandler(err);
        }),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }

  private _getProfile() {
    this._profileService
      .getProfile<EnumNotifyUserType.Agent>(this.providedProfile)
      .pipe(
        tap((profile) => {
          this._profileSubject$.next(profile);
        }),
        catchError(async (err: AppError) =>
          this._utilsService.errorHandler(err)
        )
      )
      .subscribe();
  }
}
