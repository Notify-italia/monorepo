import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AgentService } from '@notify/nfc-app-services';
import {
  AccountsTableComponent,
  LoadingComponent,
  PageHeaderComponent,
  ProfilePlayerFactory,
} from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    AccountsTableComponent,
    LoadingComponent,
  ],
  providers: [AgentService, ProfilePlayerFactory],
  templateUrl: './colleagues.component.html',
  styleUrls: ['./colleagues.component.scss'],
})
export class ColleaguesComponent {
  public colleagues$ = this._agentService.getAgents();

  constructor(
    private _agentService: AgentService,
    public profilePlayerFactory: ProfilePlayerFactory
  ) {}
}
