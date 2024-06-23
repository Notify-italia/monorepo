import { Injectable, inject } from '@angular/core';
import { INotifyLead } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class LeadsService {
  private _httpService = inject(HttpService);

  public createLead(lead: INotifyLead) {
    return this._httpService.post<INotifyLead, INotifyLead>(`/v1/lead`, lead);
  }

  public getLeads() {
    return this._httpService.get<INotifyLead[]>(`/v1/lead`);
  }
}
