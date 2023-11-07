import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ProfileFormComponent,
  ProfileViewComponent,
  ShareProfileComponent,
} from '@notify/nfc-app-components';
import { ApiService } from '@notify/nfc-app-services';
import { EnumNotifyAccountType, INotifyProfile } from '@notify/nfc-interfaces';
import { Observable, Subject, tap } from 'rxjs';

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

  constructor(private _apiService: ApiService) {
    this._apiService
      .getProfile('654a5542d872f43ae3e0aaa1')
      .pipe(
        tap((profile) => {
          this._profileSubject$.next(profile);
        })
      )
      .subscribe();
  }

  public updateSubject(profile: IProfile) {
    this._profileSubject$.next(profile);
  }
}
