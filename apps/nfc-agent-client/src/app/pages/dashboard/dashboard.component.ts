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
  WidgetAreaChartComponent,
  WidgetCounterComponent,
} from '@notify/ngx-components';
import { endOfDay, startOfDay, subWeeks } from 'date-fns';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { Subject, combineLatest, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    ShareProfileComponent,
    WidgetCounterComponent,
    WidgetAreaChartComponent,
  ],
  providers: [StatService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public areaChartScans$ = new Subject<ApexAxisChartSeries>();

  public dashboardReady$ = combineLatest({
    profile: this._profileService.getProfile(),
    user: this._authService.currentUser$.pipe(
      map((p) => {
        const _visit = p?.statsTotals?.[EnumNotifyStatType.ProfileVisit] || 0;
        const _return = p?.statsTotals?.[EnumNotifyStatType.ProfileReturn] || 0;

        const totalVisits = _visit + _return;
        const percentReturn = totalVisits ? (_return / totalVisits) * 100 : 0;

        return {
          ...p,
          statsMapped: {
            totalVisits,
            percentReturn,
          },
        };
      })
    ),
    areaChart: this.areaChartScans$,
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
  ) {
    this.getProfileVisits({
      from: startOfDay(subWeeks(new Date(), 1)),
      to: endOfDay(new Date()),
    }).subscribe();
  }

  public getProfileVisits(period: { from: Date; to: Date }) {
    return this._statService
      .getStat(EnumNotifyStatType.ProfileVisit, period)
      .pipe(
        map((s) => {
          const mapped = s.map((stat) => ({
            x: new Date(stat.period.from),
            y: stat.value,
          }));

          return [{ name: 'Visite', data: mapped }];
        }),
        tap((s) => this.areaChartScans$.next(s))
      );
  }
}
