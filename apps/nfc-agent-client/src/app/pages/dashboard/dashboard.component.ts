import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EnumNotifyStatType, INotifyUser } from '@notify/interfaces';
import {
  AuthService,
  CapacitorService,
  NoteService,
  ProfileService,
  StatService,
  SvgBoxIcon,
  SvgboxService,
} from '@notify/nfc-app-services';
import {
  AREA_CHART_DEFAULT_PERIOD,
  LoadingComponent,
  PageHeaderComponent,
  ShareProfileComponent,
  WidgetAreaChartComponent,
  WidgetCounterComponent,
  WidgetFeedbackComponent,
  WidgetNoteComponent,
  WidgetPieChartComponent,
} from '@notify/ngx-shared';
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
  providers: [StatService, NoteService, SvgboxService, CapacitorService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public areaChartScans$ = new Subject<ApexAxisChartSeries>();

  public dashboard$ = combineLatest({
    latestNote: this._noteService.getLatestNote(),
    profile: this._profileService.getProfile(),
    user: this._authService.currentUser$.pipe(
      map((user) => this._statService.userCounters(user as INotifyUser))
    ),
    areaChart: this.areaChartScans$,
  });

  public isNative = this._capacitorService.isNative;
  public baseUrl = environment.profilesUrl;
  public production = environment.production;
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
    private _capacitorService: CapacitorService
  ) {
    this.getProfileVisits(AREA_CHART_DEFAULT_PERIOD).subscribe();
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
