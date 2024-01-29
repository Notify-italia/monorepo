import { Injectable } from '@angular/core';

import { INotifyStat } from '@notify/interfaces';
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
}
