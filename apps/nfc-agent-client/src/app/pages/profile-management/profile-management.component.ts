import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  PageHeaderComponent,
  ProfileFormComponent,
  ProfileViewComponent,
  ShareProfileComponent,
} from '@notify/ngx-components';

import {
  AppError,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
import { ProfileService } from '@notify/nfc-app-services';
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
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  private _profileSubject$ = new Subject<IProfile>();

  public profile$: Observable<IProfile> = this._profileSubject$;

  constructor(
    private _profileService: ProfileService,
    private _toastr: ToastrService
  ) {
    this._getProfile();
  }

  public publicProfileUrl(profile: IProfile) {
    return this._profileService.getPublicProfileUrl(
      environment.publicUrl,
      profile._id
    );
  }

  public updateProfileSubject(profile: INotifyProfile) {
    this._profileSubject$.next(profile as IProfile);
  }

  public reloadForm() {
    //TODO trovare un modo più elegante per ricaricare il form
    location.reload();
  }

  public saveProfile(profile: IProfile) {
    this._profileService
      .patchProfile<EnumNotifyUserType.Agent>(profile)
      .pipe(
        tap((profile) => {
          this._toastr.success('Profilo aggiornato', 'Successo');
          this._profileSubject$.next(profile);
        }),
        catchError(async (err: AppError) => {
          this._toastr.error(
            err?.error?.errors?.[0]?.message || 'Si è verificato un errore',
            'Errore'
          );
          return err;
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
        catchError(async (err: AppError) => {
          this._toastr.error(
            err?.error?.errors?.[0]?.message || 'Si è verificato un errore',
            'Errore'
          );
          return err;
        })
      )
      .subscribe();
  }
}
