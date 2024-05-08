import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AgentService,
  CachedSrcDirective,
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

import { RouterLink } from '@angular/router';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import { CompanyService } from '@notify/ngx-shared';
import { combineLatest, map, take, tap } from 'rxjs';
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
    RouterLink,
    SaveIndicatorComponent,
    CachedSrcDirective,
    ProfileTemplateBaseComponent,
  ],
  providers: ProfileManagementBaseProviders,
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent extends ProfileManagementBaseComponent {
  public sharedNotesSelect$ = combineLatest([this.profile$, this.notes$]).pipe(
    take(1),
    map(([a, notes]) => notes.filter((n) => n.owners.includes(a.owner || ''))),
    map((notes) =>
      notes.map((note) => ({
        name: note.title,
        value: note._id,
      }))
    )
  );

  constructor(
    private _companyService: CompanyService,
    private _agentService: AgentService
  ) {
    super(environment as unknown as { [key: string]: string });
  }

  override removeSavedRedirect(redirect: string) {
    this.loading = true;

    this._companyService
      .patchCompany({
        savedRedirects: this.savedRedirects.filter((r) => r !== redirect),
      })
      .pipe(this.refreshTokenPipe())
      .subscribe();
  }

  override updateSavedRedirects(profile: INotifyProfile) {
    const savedRedirects = this.getSavedRedirects(profile);

    return this._companyService.patchCompany({
      savedRedirects,
    });
  }

  override _fetchProfileSubscription() {
    this._profileService
      .getProfile<EnumNotifyUserType.Agent>(this.providedProfile)
      .pipe(
        tap((profile) => {
          this._profileSubject$.next(profile);
        }),
        this.errorHandlerPipe()
      )
      .subscribe();
  }
}
