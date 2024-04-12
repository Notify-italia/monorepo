import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  LoadingComponent,
  RootService,
  WidgetCounterComponent,
} from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, WidgetCounterComponent, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private _rootService = inject(RootService);
  public dashboard$ = this._rootService.getDashboard();
}
