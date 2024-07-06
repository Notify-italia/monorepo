import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class NotificationsService {
  constructor(private http: HttpService) {}

  public getUnreadNotificationsCount() {
    return this.http.get<{ result: number }>('/v1/notifications/count/unread');
  }
}
