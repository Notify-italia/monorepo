import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INotifyAgent } from '@notify/interfaces';
import { AgentService, ProfileService } from '@notify/nfc-app-services';
import {
  AccountsTableComponent,
  LoadingComponent,
  PageHeaderComponent,
  ProfilePlayerFactory,
} from '@notify/ngx-components';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    AccountsTableComponent,
    LoadingComponent,
  ],
  providers: [AgentService, ProfilePlayerFactory, ProfileService],
  templateUrl: './colleagues.component.html',
  styleUrls: ['./colleagues.component.scss'],
})
export class ColleaguesComponent {
  public colleagues$ = this._agentService.getAgents();

  constructor(
    private _agentService: AgentService,
    private _profileFactory: ProfilePlayerFactory,
    private _profileService: ProfileService
  ) {}

  public inspectProfile(profile: INotifyAgent['profile']) {
    if (!profile) {
      return;
    }

    this._profileFactory.createPlayer({
      profile,
      playerUrl: this._profileService.genPlayerUrl(
        environment.publicUrl,
        profile._id
      ),
    });
  }
}
