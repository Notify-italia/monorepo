import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileViewComponent } from '@notify/nfc-app-components';
import { ApiService } from '@notify/nfc-app-services';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'notify-profile',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public profile$: Observable<INotifyProfile>;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _apiService: ApiService
  ) {
    this.profile$ = this._apiService.getProfile(
      this._activatedRoute.snapshot.queryParamMap.get('p') as string
    );
  }
}
