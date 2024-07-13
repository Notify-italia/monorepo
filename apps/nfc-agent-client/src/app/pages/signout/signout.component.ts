import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AuthService,
  CapacitorService,
  LoadingComponent,
  NotificationsService,
} from '@notify/ngx-shared';
import { from, of, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  providers: [NotificationsService, CapacitorService],
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent {
  constructor(
    private _authService: AuthService,
    private _notificationsService: NotificationsService,
    private _capacitorService: CapacitorService
  ) {
    if (!this._capacitorService.isNative) {
      this._authService.signOut();
      return;
    }

    from(this._notificationsService.getFCMToken())
      .pipe(
        tap((r) => console.log(r.token)),
        switchMap((r) => {
          if (!r.token) {
            return of(true);
          }

          return this._authService.deleteFCMToken(r.token);
        }),
        tap(() => this._authService.signOut())
      )
      .subscribe();
  }
}
