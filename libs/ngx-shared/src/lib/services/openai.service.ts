import { Injectable, inject } from '@angular/core';
import { INotifyLead } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class OpenAIService {
  private _httpService = inject(HttpService);

  public createLead(lead: INotifyLead) {
    return this._httpService.post<INotifyLead, INotifyLead>(`/v1/leads`, lead);
  }

  public analyzeBusinessCard(url: string) {
    return this._httpService.post<{ url: string }, INotifyLead>(
      `/v1/openai/businesscard-data`,
      {
        url,
      }
    );
  }
}
