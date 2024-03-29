import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CachedSrcDirective,
  LoadingComponent,
  PageHeaderComponent,
  ProfileFormComponent,
  ProfileManagementBaseComponent,
  ProfilePlayerFactory,
  ProfileTemplateBaseComponent,
  ProfileViewComponent,
  SaveIndicatorComponent,
  ShareProfileComponent,
} from '@notify/ngx-shared';

import { RouterLink } from '@angular/router';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import { CompanyService, UtilsService } from '@notify/ngx-shared';
import { tap } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'notify-profile-management',
  standalone: true,
  imports: [
    CommonModule,
    ProfileFormComponent,
    ProfileViewComponent,
    ShareProfileComponent,
    PageHeaderComponent,
    LoadingComponent,
    RouterLink,
    SaveIndicatorComponent,
    CachedSrcDirective,
    ProfileTemplateBaseComponent,
  ],
  providers: [ProfilePlayerFactory, UtilsService, CompanyService],
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent extends ProfileManagementBaseComponent {
  constructor(private _companyService: CompanyService) {
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

  override _getProfile() {
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
