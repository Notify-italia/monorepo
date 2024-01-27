import { Injectable } from '@angular/core';
import { INotifyAgent, INotifyPartialAgent } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class AgentService {
  constructor(private http: HttpService) {}

  public getAgents(id?: string | string[]) {
    if (id) {
      return this.http.get<INotifyAgent[]>(`/v1/agent`, {
        id: (Array.isArray(id) ? id : [id]).join(','),
      });
    }
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
      `/v1/agent`,
      agent,
      {
        id,
      }
    );
  }

  public delete(id: string) {
    return this.http.delete(`/v1/agent`, {
      id,
    });
  }
}
