import { Injectable } from '@angular/core';

import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import { HttpService } from './http.service';

@Injectable()
export class ProfileService {
  constructor(private http: HttpService) {}

  public cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  public buildCompanyLocation(d?: INotifyProfile['address']) {
    if (!d) {
      return null;
    }

    return `${d.street} ${d.number}, ${d.city}`;
  }

  public genPlayerUrl(publicUrl: string, id: string) {
    return `${publicUrl}/profile?p=${id}`;
  }

  public patchProfile<T extends EnumNotifyUserType>(
    body: INotifyProfile,
    id?: string
  ) {
    return this.http.patch<INotifyProfile, INotifyProfile<T>>(
      `/v1/profile`,
      body,
      id ? { id } : undefined
    );
  }

  public getProfile<T extends EnumNotifyUserType>(id?: string) {
    return this.http.get<INotifyProfile<T>>(
      `/v1/profile`,
      id ? { id } : undefined
    );
  }
}
