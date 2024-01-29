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
  CapacitorService,
  ProfileService,
  UtilsService,
} from '@notify/nfc-app-services';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, tap } from 'rxjs';
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
  providers: [ProfilePlayerFactory, CapacitorService],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  private _profileSubject$ = new Subject<IProfile>();
  public profile$: Observable<IProfile> = this._profileSubject$;

  public loading = false;

  public baseUrl = environment.profilesUrl;

  constructor(
    private _profileService: ProfileService,
    private _utilsService: UtilsService,
    private _toastr: ToastrService,
    private _playerFactroy: ProfilePlayerFactory
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
        tap((profile) => {
          this._profileSubject$.next(profile);
        }),
        catchError(async (err: AppError) =>
          this._utilsService.errorHandler(err)
        ),
        tap(() => (this.loading = false))
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
        catchError(async (err: AppError) => {
          return this._utilsService.errorHandler(err);
        }),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }
}
