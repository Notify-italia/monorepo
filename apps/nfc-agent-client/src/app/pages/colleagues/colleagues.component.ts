import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppError, INotifyAgent } from '@notify/interfaces';
import {
  AgentService,
  ProfileService,
  UtilsService,
} from '@notify/nfc-app-services';
import {
  AccountsTableComponent,
  LoadingComponent,
  PageHeaderComponent,
  ProfilePlayerFactory,
} from '@notify/ngx-shared';
import { catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    AccountsTableComponent,
    LoadingComponent,
  ],
  providers: [AgentService, ProfilePlayerFactory, ProfileService, UtilsService],
  templateUrl: './colleagues.component.html',
  styleUrls: ['./colleagues.component.scss'],
})
export class ColleaguesComponent {
  public colleagues$ = this._agentService
    .getAgents()
    .pipe(
      catchError((e: AppError) =>
        this._utilsService.errorHandler<INotifyAgent[]>(e, [])
      )
    );

  constructor(
    private _agentService: AgentService,
    private _profileFactory: ProfilePlayerFactory,
    private _profileService: ProfileService,
    private _utilsService: UtilsService
  ) {}

  public async inspectProfile(profile: INotifyAgent['profile']) {
    this._profileService
      .getProfile(profile?._id)
      .pipe(
        tap((p) => {
          if (!p) {
            return;
          }

          this._profileFactory.createPlayer({
            profile: p,
            baseUrl: environment.profilesUrl,
          });
        })
      )
      .subscribe();
  }
}
