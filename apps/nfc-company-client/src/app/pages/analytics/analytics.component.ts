import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  EnumNotifyStatType,
  INotifyAgent,
  INotifyFeedback,
  INotifyProfile,
} from '@notify/interfaces';
import {
  AgentService,
  FeedbackService,
  SvgBoxIcon,
} from '@notify/nfc-app-services';
import {
  LoadingComponent,
  PageHeaderComponent,
  WidgetBarChartComponent,
  WidgetCounterComponent,
  WidgetFeedbackComponent,
  WidgetProfileCardComponent,
} from '@notify/ngx-components';
import { startOfMonth } from 'date-fns';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { combineLatest, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    WidgetCounterComponent,
    WidgetFeedbackComponent,
    WidgetBarChartComponent,
    WidgetProfileCardComponent,
    RouterModule,
    LoadingComponent,
  ],
  providers: [AgentService, FeedbackService],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  public dashboard$ = combineLatest({
    agents: this._agentService.getAgents(),
    feedbacks: this._feedbackService.getFeedbacks({
      from: startOfMonth(new Date()),
      to: new Date(),
    }),
  }).pipe(
    map(({ agents, feedbacks }) => ({
      ...this._agentsStats(agents),
      ...this._feedbackStats(feedbacks, agents),
    }))
  );

  public baseUrl = environment.profilesUrl;

  public classicBusinessCardCO2 = 0.02;
  public nfcBusinessCardCO2 = 0.06;

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

  public get currentMonth() {
    return new Date().toLocaleString('default', { month: 'long' });
  }

  constructor(
    private _feedbackService: FeedbackService,
    private _agentService: AgentService,
    private _router: Router
  ) {}

  public goToDetails = () => {
    this._router.navigate(['pages/analytics/detail']);
  };

  private _cleanUserEmail = (email: string) => email.split('@')[0];

  private _absoluteStatProperty = (
    users: INotifyAgent[],
    property: EnumNotifyStatType
  ) => {
    return users.reduce((acc, agent) => {
      acc += agent.statsTotals?.[property] || 0;
      return acc;
    }, 0);
  };

  private _comparableStatProperty = (
    users: INotifyAgent[],
    property: EnumNotifyStatType
  ) => {
    return users.reduce((acc: { [key: string]: number }, agent) => {
      acc[`${agent.email}`] = agent.statsTotals?.[property] || 0;
      return acc;
    }, {});
  };

  private _savedCO2 = (totalVisits: number, totalUsers: number) => {
    const value =
      totalVisits * this.classicBusinessCardCO2 -
      totalUsers * this.nfcBusinessCardCO2;

    return value > 0 ? Number(value.toFixed(2)) : 0;
  };

  private _feedbackStats = (
    feedbacks: INotifyFeedback[],
    agents: INotifyAgent[]
  ) => {
    const usersPerRating: {
      agent: string;
      rating: number;
      count: number;
      averageRating: number;
      profile?: INotifyProfile;
    }[] = feedbacks
      .reduce((acc: { agent: string; rating: number; count: number }[], c) => {
        const foundIndex = acc.findIndex((a) => a.agent === c.owner);

        if (foundIndex === -1) {
          return [...acc, { agent: c.owner, rating: c.rating, count: 1 }];
        }

        acc[foundIndex].rating += c.rating;
        acc[foundIndex].count++;

        return acc;
      }, [])
      .map((a) => ({
        ...a,
        averageRating: a.rating / a.count,
      }))
      .sort((a, b) => b.averageRating - a.averageRating);

    const bestUser = usersPerRating[0];
    const worstUser = usersPerRating[usersPerRating.length - 1];

    bestUser.profile = agents.find((a) => a._id === bestUser.agent)?.profile;
    worstUser.profile = agents.find((a) => a._id === worstUser.agent)?.profile;

    return {
      bestUser,
      worstUser,
    };
  };

  private _agentsStats = (agents: INotifyAgent[]) => {
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

    const totalFeedbackCount = this._absoluteStatProperty(
      agents,
      EnumNotifyStatType.ProfileFeedbackCount
    );

    const totalAverageFeedbackRating =
      _totalFeedbackRating / totalFeedbackCount || 0;

    return {
      agentsPerVisitSeries,
      totalVisits,
      totalSaved,
      totalAverageFeedbackRating,
      totalFeedbackCount,
      totalCO2Saved: this._savedCO2(totalVisits, agents.length),
    };
  };
}
