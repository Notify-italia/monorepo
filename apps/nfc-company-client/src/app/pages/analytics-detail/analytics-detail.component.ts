import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  EnumNotifyStatType,
  INotifyAgent,
  INotifyStat,
  INotifyUser,
} from '@notify/interfaces';
import {
  AgentService,
  FeedbackService,
  StatService,
  SvgBoxIcon,
} from '@notify/nfc-app-services';
import {
  AREA_CHART_DEFAULT_PERIOD,
  AvatarComponent,
  LoadingComponent,
  NoItemsComponent,
  PageHeaderComponent,
  SearchBarComponent,
  ShareProfileComponent,
  TailwindFormsModule,
  WidgetAreaChartComponent,
  WidgetCounterComponent,
  WidgetFeedbackComponent,
  WidgetNoteComponent,
  WidgetPieChartComponent,
} from '@notify/ngx-components';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { Observable, Subject, combineLatest, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalyiticsDetailRowComponent } from '../../components/analyitics-detail-row/analyitics-detail-row.component';

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
    RouterModule,
    NoItemsComponent,
    AvatarComponent,
    SearchBarComponent,
    AnalyiticsDetailRowComponent,
    WidgetCounterComponent,
    WidgetAreaChartComponent,
    WidgetFeedbackComponent,
    WidgetNoteComponent,
    WidgetPieChartComponent,
    TailwindFormsModule,
    ReactiveFormsModule,
    ShareProfileComponent,
  ],
  providers: [AgentService, StatService, FeedbackService],
  templateUrl: './analytics-detail.component.html',
  styleUrl: './analytics-detail.component.scss',
})
export class AnalyticsDetailComponent implements OnDestroy {
  public agents$ = this._agentService.getAgents();
  public stat$ = new Observable<INotifyStat[]>();
  public destroy$ = new Subject<void>();

  public areaChartScans$ = new Subject<ApexAxisChartSeries>();
  public selectAgents$ = this.agents$.pipe(
    map((agents) =>
      agents.map((agent) => {
        let name = `${agent.profile?.name} ${agent.profile?.surname}`;

        if (!name.trim()) {
          name = agent.email;
        }

        return { name, value: JSON.stringify(agent) };
      })
    )
  );

  public baseUrl = environment.profilesUrl;
  public selectedAgent = new FormControl<INotifyAgent>({} as INotifyAgent);
  public agents: INotifyAgent[] = [];
  public filterableFields = [
    'email',
    'profile.email',
    'profile.name',
    'profile.surname',
    'profile.email',
    'profile.phone',
    'profile.customFields.iconName',
    'profile.customFields.value',
    'createdAt',
    'profile.role',
  ];

  public agentStats$ = combineLatest({
    visits: this.areaChartScans$,
    feedbacks: this.selectedAgent.valueChanges.pipe(
      switchMap((agent) =>
        this._feedbackService.getFeedbacks(
          {
            from: new Date(agent?.createdAt || new Date()),
            to: new Date(),
          },
          agent?._id
        )
      )
    ),
    totals: this.selectedAgent.valueChanges.pipe(
      map((agent) => this._statService.userCounters(agent as INotifyUser))
    ),
    user: this.selectedAgent.valueChanges.pipe(
      map((agent) => agent as INotifyUser)
    ),
  });

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
    private _router: Router,
    private _agentService: AgentService,
    private _statService: StatService,
    private _feedbackService: FeedbackService
  ) {
    this.selectedAgent.valueChanges
      .pipe(
        switchMap((agent) => {
          return this.getProfileVisits(
            agent?._id || '',
            AREA_CHART_DEFAULT_PERIOD
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goBack(): void {
    this._router.navigate(['pages/analytics']);
  }

  public getProfileVisits(userId: string, period: { from: Date; to: Date }) {
    return this._statService
      .getStat(EnumNotifyStatType.ProfileVisit, period, userId)
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
