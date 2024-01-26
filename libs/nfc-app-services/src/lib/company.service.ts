import { Injectable } from '@angular/core';

import { INotifyCompany, INotifyLicense } from '@notify/interfaces';
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

  public patchLicense(publicKey: INotifyLicense['publicKey']) {
    return this.http.patch<
      {
        publicKey: INotifyLicense['publicKey'];
      },
      INotifyLicense
    >(`/v1/company/license`, {
      publicKey,
    });
  }
}
