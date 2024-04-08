import { Inject, Injectable, inject } from '@angular/core';
import {
  EnumNotifyUserType,
  INotifyAgent,
  INotifyCompany,
} from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  private httpService = inject(HttpService);

  public get authKey() {
    return localStorage.getItem(this.tokenPath);
  }

  constructor(@Inject('tokenPath') private tokenPath: string) {}

  public setAuthentication(data: string) {
    localStorage.setItem(this.tokenPath, data);
  }

  public getCustomers(config: { page: number; items: number }) {
    return this.httpService.get<INotifyCompany<true>>('/v1/customers', config);
  }

  public getCustomer(id: string) {
    return this.httpService.get<
      INotifyCompany<true> & { users: INotifyAgent[] }
    >(`/v1/customer`, { id });
  }

  public getDashboard() {
    return this.httpService.get<{
      companies: number;
      activeCompanies: number;
      agents: number;
      profileVisit: number;
      provileSave: number;
      boughtCards: number;
    }>('/v1/dashboard');
  }

  public loginAsUser(id: string, type: EnumNotifyUserType) {
    return this.httpService.post<
      {
        id: string;
        type: EnumNotifyUserType;
      },
      {
        token: string;
      }
    >(`/v1/customer/generate-token`, { id, type });
  }
}

export const provideRootService = (tokenPath: string) => ({
  provide: RootService,
  useFactory: () => new RootService(tokenPath),
  deps: [HttpService],
});
