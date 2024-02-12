import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LoadingComponent,
  PageHeaderComponent,
  ProfileFormComponent,
  ProfilePlayerFactory,
  ProfileViewComponent,
  ShareProfileComponent,
} from '@notify/ngx-components';

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

  public get savedRedirects() {
    return this._authService.user?.savedRedirects || [];
  }

  constructor(
    private _profileService: ProfileService,
    private _utilsService: UtilsService,
    private _playerFactroy: ProfilePlayerFactory,
    private _authService: AuthService,
    private _companyService: CompanyService
  ) {
    this._getProfile();
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
      .patchProfile<EnumNotifyUserType.Agent>(profile)
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

  public removeSavedRedirect(redirect: string) {
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
        })
      )
      .subscribe();
  }

  private _getProfile() {
    this._profileService
      .getProfile<EnumNotifyUserType.Agent>()
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
