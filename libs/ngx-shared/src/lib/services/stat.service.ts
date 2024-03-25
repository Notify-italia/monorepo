import { Injectable } from '@angular/core';

import {
  EnumNotifyStatType,
  INotifyStat,
  INotifyUser,
} from '@notify/interfaces';
import { HttpService } from './http.service';
import { SvgboxService } from './svgbox.service';
import { UtilsService } from './utils.service';

export interface INotifyUserCounters {
  totalVisits: number;
  percentReturn: number;
  averageFeedback: number;
  integrationsCountValues: number[];
  integrationsCountLabels: string[];
}

@Injectable()
export class StatService {
  constructor(
    private http: HttpService,
    private _svgboxService: SvgboxService,
    private _utilsService: UtilsService
  ) {}

  public incrementStat(
    type: INotifyStat['type'],
    owner: INotifyStat['owner'],
    value?: INotifyStat['value']
  ) {
    return this.http.post<
      {
        type: INotifyStat['type'];
        owner: INotifyStat['owner'];
        value?: INotifyStat['value'];
      },
      INotifyStat
    >(`/v1/stat`, {
      type,
      value,
      owner,
    });
  }

  public incrementStatCounter(
    type: INotifyStat['type'] | string,
    owner: INotifyStat['owner'],
    userType: INotifyUser['userType'],
    value?: INotifyStat['value']
  ) {
    return this.http.post<
      {
        type: INotifyStat['type'] | string;
        owner: INotifyStat['owner'];
        userType: INotifyUser['userType'];
        value?: INotifyStat['value'];
      },
      INotifyStat
    >(`/v1/stat/counter`, {
      type,
      value,
      userType,
      owner,
    });
  }

  public userCounters(user: INotifyUser) {
    const _visit = user?.statsTotals?.[EnumNotifyStatType.ProfileVisit] || 0;
    const _return = user?.statsTotals?.[EnumNotifyStatType.ProfileReturn] || 0;

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
          this._svgboxService.getIcon(i.split(':count')[0].split('item:')[1])
            ?.expanded
      )
      .filter((i) => i) as string[];

    return {
      ...user?.statsTotals,
      totalVisits,
      percentReturn,
      averageFeedback,
      integrationsCountValues: integrationsCount
        .map((i) => user?.statsTotals[i])
        .filter((i) => i) as number[],
      integrationsCountLabels,
    };
  }

  public getStat(
    type: INotifyStat['type'],
    period?: INotifyStat['period'],
    owner?: INotifyStat['owner']
  ) {
    const params: Partial<INotifyStat> & { from?: string; to?: string } = {
      type,
    };

    if (period) {
      params['from'] = this._utilsService
        .compensateUTCDate(period.from)
        .toISOString();
      params['to'] = this._utilsService
        .compensateUTCDate(period.to)
        .toISOString();
    }

    if (owner) {
      params.owner = owner;
    }

    return this.http.get<INotifyStat[]>(`/v1/stat`, params);
  }
}
