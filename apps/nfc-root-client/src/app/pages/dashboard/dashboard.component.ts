import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnumNotifyUserType, INotifyUser } from '@notify/interfaces';
import {
  AvatarComponent,
  LoadingComponent,
  PageHeaderComponent,
  ProfileService,
  RootService,
  WidgetCounterComponent,
} from '@notify/ngx-shared';
import { switchMap, tap, timer } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    WidgetCounterComponent,
    LoadingComponent,
    PageHeaderComponent,
    AvatarComponent,
    RouterModule,
  ],
  providers: [ProfileService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public profileService = inject(ProfileService);
  private _rootService = inject(RootService);

  public isPolling = false;
  public dashboard$ = this._rootService.getDashboard().pipe(
    switchMap(() =>
      timer(0, 5000).pipe(
        tap(() => (this.isPolling = true)),
        switchMap(() => this._rootService.getDashboard()),
        tap(() => (this.isPolling = false))
      )
    )
  );

  public getCustomerRedirectUrl(user: INotifyUser) {
    if (user.profile?.type === EnumNotifyUserType.Agent) {
      return user.owner;
    }

    return user._id;
  }
}
