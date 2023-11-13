import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProfileFormComponent,
  ProfileViewComponent,
  ShareProfileComponent,
} from '@notify/nfc-app-components';

import { ProfileService } from '@notify/nfc-app-services';
import {
  AppError,
  EnumNotifyAccountType,
  INotifyProfile,
} from '@notify/nfc-interfaces';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

type IProfile = INotifyProfile<EnumNotifyAccountType.agent>;

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

  //TODO ottieni profilo dal token
  public profile$: Observable<IProfile> = this._profileSubject$;

  constructor(
    private _profileService: ProfileService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    this._profileService
      .getProfile('654a5542d872f43ae3e0aaa1')
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
    //TODO, rimuovere "profile._id" se è presente l'autenticazione tramite token
    this._profileService
      .patchProfile(profile, profile._id)
      .pipe(
        tap((profile) => {
          this._toastr.success('Profilo aggiornato', 'Successo');
          this._profileSubject$.next(profile);
        }),
        catchError(async (err: AppError) => {
          console.log(err);
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
