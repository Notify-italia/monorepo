import { Injectable } from '@angular/core';
import { INotifyAgent } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class AgentService {
  constructor(private http: HttpService) {}

  public getAgents() {
    return this.http.get<INotifyAgent[]>(`/v1/agent`);
  }
}
