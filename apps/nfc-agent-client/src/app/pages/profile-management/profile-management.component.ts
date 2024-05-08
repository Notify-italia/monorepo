import { Component } from '@angular/core';
import {
  AgentService,
  LoadingComponent,
  PageHeaderComponent,
  ProfileFormComponent,
  ProfileManagementBaseComponent,
  ProfileManagementBaseProviders,
  ProfileTemplateBaseComponent,
  ProfileViewComponent,
  SaveIndicatorComponent,
  ShareItemComponent,
} from '@notify/ngx-shared';

import { CommonModule } from '@angular/common';
import {
  EnumNotifyUserType,
  INotifyAgent,
  INotifyProfile,
} from '@notify/interfaces';
import { CachedSrcDirective } from '@notify/ngx-shared';
import { tap } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'notify-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    ProfileFormComponent,
    ProfileViewComponent,
    ShareItemComponent,
    PageHeaderComponent,
    LoadingComponent,
    SaveIndicatorComponent,
    CachedSrcDirective,
    ProfileTemplateBaseComponent,
  ],
  providers: ProfileManagementBaseProviders,
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent extends ProfileManagementBaseComponent {
  constructor(private _agentService: AgentService) {
    super(environment as unknown as { [key: string]: string });
  }

  override removeSavedRedirect(redirect: string) {
    this.loading = true;
    const user = this._authService.user as unknown as INotifyAgent;

    this._agentService
      .patch(user?._id || '', {
        savedRedirects: this.savedRedirects.filter((r) => r !== redirect),
      })
      .pipe(this.refreshTokenPipe())
      .subscribe();
  }

  override updateSavedRedirects(profile: INotifyProfile) {
    const savedRedirects = this.getSavedRedirects(profile);

    return this._agentService.patch(this._authService.user?._id || '', {
      savedRedirects,
    });
  }

  override _fetchProfileSubscription() {
    this._profileService
      .getProfile<EnumNotifyUserType.Agent>()
      .pipe(
        tap((profile) => {
          this._profileSubject$.next(profile);
        }),
        this.errorHandlerPipe()
      )
      .subscribe();
  }
}
