import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EnumNotifyStatType } from '@notify/interfaces';
import {
  AuthService,
  NoteService,
  ProfileService,
  StatService,
  SvgBoxIcon,
  SvgboxService,
} from '@notify/nfc-app-services';
import {
  LoadingComponent,
  PageHeaderComponent,
  ShareProfileComponent,
  WidgetAreaChartComponent,
  WidgetCounterComponent,
  WidgetFeedbackComponent,
  WidgetNoteComponent,
  WidgetPieChartComponent,
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
    WidgetFeedbackComponent,
    WidgetNoteComponent,
    WidgetPieChartComponent,
  ],
  providers: [StatService, NoteService, SvgboxService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public areaChartScans$ = new Subject<ApexAxisChartSeries>();

  public dashboard$ = combineLatest({
    latestNote: this._noteService.getLatestNote(),
    profile: this._profileService.getProfile(),
    user: this._authService.currentUser$.pipe(
      map((user) => {
        const _visit =
          user?.statsTotals?.[EnumNotifyStatType.ProfileVisit] || 0;
        const _return =
          user?.statsTotals?.[EnumNotifyStatType.ProfileReturn] || 0;

        const totalVisits = _visit + _return;
        const percentReturn = Number(
          (totalVisits ? (_return / totalVisits) * 100 : 0)?.toFixed(1)
        );

        const averageFeedback =
          (user?.statsTotals?.[EnumNotifyStatType.ProfileFeedbackTotalRating] ||
            0) /
          (user?.statsTotals?.[EnumNotifyStatType.ProfileFeedbackCount] || 1);

        const integrationsCount = (
          Object.keys(user?.statsTotals || []) as EnumNotifyStatType[]
        ).filter(
          (v) =>
            v.includes(
              EnumNotifyStatType.ProfileIntegrationCount.replace(
                '{{integration}}:count',
                ''
              )
            ) && v.includes('count')
        );

        const integrationsCountLabels = integrationsCount
          .map(
            (i) =>
              this._svgBoxService.getIcon(
                i.split(':count')[0].split('item:')[1]
              )?.expanded
          )
          .filter((i) => i) as string[];

        return {
          ...user,
          statsMapped: {
            totalVisits,
            percentReturn,
            averageFeedback,
            integrationsCountValues: integrationsCount
              .map((i) => user?.statsTotals[i])
              .filter((i) => i) as number[],
            integrationsCountLabels,
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
    private _authService: AuthService,
    private _noteService: NoteService,
    private _svgBoxService: SvgboxService
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
