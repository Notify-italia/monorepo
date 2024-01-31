import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EnumNotifyStatType } from '@notify/interfaces';
import {
  AuthService,
  ProfileService,
  StatService,
  SvgBoxIcon,
} from '@notify/nfc-app-services';
import {
  LoadingComponent,
  PageHeaderComponent,
  ShareProfileComponent,
  WidgetCounterComponent,
} from '@notify/ngx-components';
import { endOfDay, startOfDay, subWeeks } from 'date-fns';
import { combineLatest } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    ShareProfileComponent,
    WidgetCounterComponent,
  ],
  providers: [StatService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public profile$ = this._profileService.getProfile();
  public weeklyScans$ = this._statService.getStat(
    EnumNotifyStatType.ProfileVisit,
    {
      from: startOfDay(subWeeks(new Date(), 1)),
      to: endOfDay(new Date()),
    }
  );
  public dashboardReady$ = combineLatest({
    profile: this.profile$,
    user: this._authService.currentUser$,
    weeklyScans: this.weeklyScans$,
  });

  public baseUrl = environment.profilesUrl;
  public totalScansIcon: SvgBoxIcon = {
    expanded: 'Condivisione',
    name: 'connect_without_contact',
    set: 'materialui',
  };

  public returnFromContactBookIcon: SvgBoxIcon = {
    expanded: 'Merge',
    name: 'git-merge',
    set: 'octicons',
  };

  // public co2SavedIcon: SvgBoxIcon = {
  //   expanded: 'Eco',
  //   name: 'eco',
  //   set: 'materialui',
  // };

  public savedContactsIcon: SvgBoxIcon = {
    expanded: 'Contatti',
    name: 'contacts',
    set: 'materialui',
  };

  constructor(
    private _profileService: ProfileService,
    private _statService: StatService,
    private _authService: AuthService
  ) {}
}
