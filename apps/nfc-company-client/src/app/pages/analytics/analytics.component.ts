import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EnumNotifyStatType, INotifyAgent } from '@notify/interfaces';
import {
  AgentService,
  StatService,
  SvgBoxIcon,
} from '@notify/nfc-app-services';
import {
  LoadingComponent,
  PageHeaderComponent,
  WidgetBarChartComponent,
  WidgetCounterComponent,
  WidgetFeedbackComponent,
} from '@notify/ngx-components';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { combineLatest, map } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    WidgetCounterComponent,
    WidgetFeedbackComponent,
    WidgetBarChartComponent,
  ],
  providers: [StatService, AgentService],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  public dashboard$ = combineLatest({
    agents: this._agentService.getAgents(),
  }).pipe(
    map(({ agents }) => {
      const agentsPerVisit = this._comparableStatProperty(
        agents,
        EnumNotifyStatType.ProfileVisit
      );

      const agentsPerReturn = this._comparableStatProperty(
        agents,
        EnumNotifyStatType.ProfileReturn
      );

      const totalAgentsVisits = Object.keys(agentsPerVisit).reduce(
        (acc: { [key: string]: number }, visit) => {
          const returnVisit = agentsPerReturn[visit] || 0;
          const normalVisit = agentsPerVisit[visit] || 0;

          acc[visit] = normalVisit + returnVisit;

          return acc;
        },
        {}
      );

      const agentsPerSaves = this._comparableStatProperty(
        agents,
        EnumNotifyStatType.ProfileSave
      );

      const agentsPerVisitSeries: ApexAxisChartSeries = [
        {
          name: 'Visite',
          data: Object.keys(totalAgentsVisits).map((agent) => ({
            x: this._cleanUserEmail(agent),
            y: agentsPerVisit[agent],
          })),
        },
        {
          name: 'Salvataggi',
          data: Object.keys(agentsPerSaves).map((agent) => ({
            x: this._cleanUserEmail(agent),
            y: agentsPerSaves[agent],
          })),
        },
      ];

      const totalVisits = Object.values(agentsPerVisit).reduce(
        (acc, visit) => acc + visit,
        0
      );

      const totalSaved = this._absoluteStatProperty(
        agents,
        EnumNotifyStatType.ProfileSave
      );

      const _totalFeedbackRating = this._absoluteStatProperty(
        agents,
        EnumNotifyStatType.ProfileFeedbackTotalRating
      );

      const _totalFeedbackCount = this._absoluteStatProperty(
        agents,
        EnumNotifyStatType.ProfileFeedbackCount
      );

      const totalAverageFeedbackRating =
        _totalFeedbackRating / _totalFeedbackCount || 0;

      return {
        agentsPerVisitSeries,
        totalVisits,
        totalSaved,
        totalAverageFeedbackRating,
        totalCO2Saved: this._savedCO2(totalVisits, agents.length),
      };
    })
  );

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

  public co2SavedIcon: SvgBoxIcon = {
    expanded: 'Eco',
    name: 'eco',
    set: 'materialui',
  };

  public savedContactsIcon: SvgBoxIcon = {
    expanded: 'Contatti',
    name: 'contacts',
    set: 'materialui',
  };

  constructor(
    private _statService: StatService,
    private _agentService: AgentService
  ) {}

  private _cleanUserEmail = (email: string) => email.split('@')[0];

  private _absoluteStatProperty = (
    users: INotifyAgent[],
    property: EnumNotifyStatType
  ) => {
    return users.reduce((acc, agent) => {
      acc += agent.statsTotals[property] || 0;
      return acc;
    }, 0);
  };

  private _comparableStatProperty = (
    users: INotifyAgent[],
    property: EnumNotifyStatType
  ) => {
    return users.reduce((acc: { [key: string]: number }, agent) => {
      acc[`${agent.email}`] = agent.statsTotals[property] || 0;
      return acc;
    }, {});
  };

  private _savedCO2 = (totalVisits: number, totalUsers: number) => {
    return Number((totalVisits * 0.02 - totalUsers * 0.06).toFixed(2));
  };
}
