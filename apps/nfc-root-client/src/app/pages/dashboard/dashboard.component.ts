import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  LoadingComponent,
  PageHeaderComponent,
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
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
}
