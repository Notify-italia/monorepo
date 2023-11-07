import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { HttpService } from './http.service';

@Injectable()
export class ApiService {
  constructor(private http: HttpService) {}

  public getProfile(id: string) {
    return this.http.get<INotifyProfile>(
      `/v1/profile`,
      new HttpParams({ fromObject: { id } })
    );
  }
}
