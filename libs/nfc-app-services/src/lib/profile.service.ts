import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { HttpService } from './http.service';

@Injectable()
export class ProfileService {
  constructor(private http: HttpService) {}

  public cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  public getPublicProfileUrl(publicUrl: string, id: string) {
    return `${publicUrl}/profile?p=${id}`;
  }

  public patchProfile(body: INotifyProfile, id?: string) {
    return this.http.patch<INotifyProfile, INotifyProfile>(
      `/v1/profile`,
      body,
      id ? { id } : undefined
    );
  }

  public getProfile(id: string) {
    return this.http.get<INotifyProfile>(`/v1/profile`, { id });
  }
}
