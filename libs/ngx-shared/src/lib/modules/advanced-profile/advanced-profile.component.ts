import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INotifyProfile } from '@notify/interfaces';
import { Observable, Subject, tap } from 'rxjs';
import { ProfileService } from '../../services';
import { LoadingComponent } from '../../standalones';
import { ProfileViewComponent } from '../profile';
import { LeftPanelComponent } from './parts/left-panel/left-panel.component';
import { RightPanelComponent } from './parts/right-panel/right-panel.component';

@Component({
  selector: 'notify-advanced-profile',
  standalone: true,
  imports: [
    CommonModule,
    LeftPanelComponent,
    RightPanelComponent,
    LoadingComponent,
    ProfileViewComponent,
  ],
  templateUrl: './advanced-profile.component.html',
  styleUrl: './advanced-profile.styles.scss',
})
export class AdvancedProfileComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _profileSerivce = inject(ProfileService);

  private _profileSubject = new Subject<INotifyProfile>();
  public profile$: Observable<INotifyProfile> = this._profileSubject;

  public loading = false;
  public environment: {
    profilesUrl: string;
  } = this._route.snapshot.data['environment'];

  public get providedId() {
    return this._route.snapshot.queryParamMap.get('p') || undefined;
  }

  public ngOnInit() {
    this.refreshProfile().subscribe();
  }

  public refreshProfile() {
    this.loading = true;
    return (this.profile$ = this._profileSerivce
      .getProfile(this.providedId)
      .pipe(
        tap((v) => this._profileSubject.next(v)),
        tap(() => (this.loading = false))
      ));
  }
}
