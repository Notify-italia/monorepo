import { Injectable } from '@angular/core';
import { INotifyAgent, INotifyPartialAgent } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class AgentService {
  constructor(private http: HttpService) {}

  public getAgents() {
    return this.http.get<INotifyAgent[]>(`/v1/agent`);
  }

  public signUp(agent: INotifyPartialAgent) {
    return this.http.post<INotifyPartialAgent, INotifyAgent>(
      `/v1/agent`,
      agent
    );
  }

  public patch(id: string, agent: INotifyPartialAgent) {
    return this.http.patch<INotifyPartialAgent, INotifyAgent>(
      `/v1/agent/${id}`,
      agent
    );
  }
}
