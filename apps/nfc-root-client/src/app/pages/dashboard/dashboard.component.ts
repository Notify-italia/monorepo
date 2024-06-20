import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  LoadingComponent,
  PageHeaderComponent,
  RootService,
  WidgetCounterComponent,
} from '@notify/ngx-shared';
import { delay, of, repeat, switchMap } from 'rxjs';

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
  public dashboard$ = of(null).pipe(
    switchMap(() => this._rootService.getDashboard()),
    delay(1000),
    repeat()
  );
}
