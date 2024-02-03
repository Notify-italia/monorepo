import { Injectable } from '@angular/core';

import { INotifyStat, INotifyUser } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class StatService {
  constructor(private http: HttpService) {}

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

  public getStat(
    type: INotifyStat['type'],
    period?: INotifyStat['period'],
    owner?: INotifyStat['owner']
  ) {
    const params: Partial<INotifyStat> & { from?: string; to?: string } = {
      type,
    };

    if (period) {
      params['from'] = period.from.toISOString();
      params['to'] = period.to.toISOString();
    }

    if (owner) {
      params.owner = owner;
    }

    return this.http.get<INotifyStat[]>(`/v1/stat`, params);
  }
}
