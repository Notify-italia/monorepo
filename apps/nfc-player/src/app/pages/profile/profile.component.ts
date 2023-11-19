import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { INotifyProfile } from '@notify/interfaces';
import { ProfileService } from '@notify/nfc-app-services';
import { ProfileViewComponent } from '@notify/ngx-components';
import { Observable, catchError, tap } from 'rxjs';
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
  public feedbackKey = environment.feedbackKey;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _profileService: ProfileService,
    private _titleService: Title,
    private _router: Router
  ) {
    this.profile$ = this._profileService
      .getProfile(
        this._activatedRoute.snapshot.queryParamMap.get('p') as string
      )
      .pipe(
        tap((profile) => {
          this._titleService.setTitle(`${profile.name} - Notify`);
        }),
        catchError((err) => {
          this._router.navigate(['/404']);
          throw new Error(err);
        })
      );
  }
}
