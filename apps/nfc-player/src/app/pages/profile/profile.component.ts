import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileViewComponent } from '@notify/nfc-app-components';
import { ProfileService } from '@notify/nfc-app-services';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'notify-profile',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public profile$: Observable<INotifyProfile>;

  public publicUrl = environment.publicUrl;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _profileService: ProfileService
  ) {
    this.profile$ = this._profileService.getProfile(
      this._activatedRoute.snapshot.queryParamMap.get('p') as string
    );
  }
}
