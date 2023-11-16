import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProfileFormComponent,
  ProfileViewComponent,
  ShareProfileComponent,
} from '@notify/ngx-components';

import {
  AppError,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
import { AuthService, ProfileService } from '@notify/nfc-app-services';
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
  ],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {
  private _profileSubject$ = new Subject<IProfile>();

  public profile$: Observable<IProfile> = this._profileSubject$;

  constructor(
    private _profileService: ProfileService,
    private _toastr: ToastrService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this._profileService
      .getProfile(this._authService.user?.profile || '')
      .pipe(
        tap((profile) => {
          this._profileSubject$.next(profile);
        })
      )
      .subscribe();
  }

  public publicProfileUrl(profile: IProfile) {
    return this._profileService.getPublicProfileUrl(
      environment.publicUrl,
      profile._id
    );
  }

  public updateProfileSubject(profile: IProfile) {
    this._profileSubject$.next(profile);
  }

  public reloadForm() {
    //get the current route
    const currentRoute = this._router.url;

    //navigate to the same page
    this._router.navigate(['/'], { skipLocationChange: true }).then(() => {
      this._router.navigate([currentRoute]);
    });
  }

  public saveProfile(profile: IProfile) {
    this._profileService
      .patchProfile(profile, this._authService.user?.profile || '')
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
}
