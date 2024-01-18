import { Injectable } from '@angular/core';

import { INotifyCompany } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class CompanyService {
  constructor(private http: HttpService) {}

  public patchCompany(body: Partial<INotifyCompany>) {
    return this.http.patch<Partial<INotifyCompany>, INotifyCompany>(
      `/v1/company`,
      body
    );
  }
}
