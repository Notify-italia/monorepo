import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { INotifyAgent } from '@notify/interfaces';
import { AgentService } from '@notify/nfc-app-services';
import {
  AvatarComponent,
  LoadingComponent,
  NoItemsComponent,
  PageHeaderComponent,
  SearchBarComponent,
  ShareProfileComponent,
  WidgetAreaChartComponent,
  WidgetCounterComponent,
  WidgetFeedbackComponent,
  WidgetNoteComponent,
  WidgetPieChartComponent,
} from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    ShareProfileComponent,
    WidgetCounterComponent,
    WidgetAreaChartComponent,
    WidgetFeedbackComponent,
    WidgetNoteComponent,
    WidgetPieChartComponent,
    RouterModule,
    NoItemsComponent,
    AvatarComponent,
    SearchBarComponent,
  ],
  providers: [AgentService],
  templateUrl: './analytics-detail.component.html',
  styleUrl: './analytics-detail.component.scss',
})
export class AnalyticsDetailComponent {
  public agents$ = this._agentService.getAgents();

  public agents: INotifyAgent[] = [];

  constructor(private _router: Router, private _agentService: AgentService) {}

  public goBack(): void {
    this._router.navigate(['pages/analytics']);
  }
}
