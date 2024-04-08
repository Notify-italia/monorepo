import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import {
  AccountsTableComponent,
  AppTitleComponent,
  IAccountsTableConfig,
  LicenseInfoComponent,
  LoadingComponent,
  ProfilePlayerFactory,
  ProfileViewComponent,
  RootService,
} from '@notify/ngx-shared';
import { map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ProfileViewComponent,
    AccountsTableComponent,
    LicenseInfoComponent,
    LoadingComponent,
    AppTitleComponent,
  ],
  providers: [ProfilePlayerFactory],
  templateUrl: './inspect-customer.component.html',
  styleUrl: './inspect-customer.component.scss',
})
export class InspectCustomerComponent {
  private _rootService = inject(RootService);
  private _activatedRoute = inject(ActivatedRoute);
  private _profilePlayerFactory = inject(ProfilePlayerFactory);

  public userTypes = EnumNotifyUserType;

  public customer$ = this._rootService
    .getCustomer(
      this._activatedRoute.snapshot.queryParamMap.get('id') as string
    )
    .pipe(
      map((customer) => {
        return {
          ...customer,
          users$: of(customer.users),
        };
      })
    );

  public tableConfig: IAccountsTableConfig = {
    allowedActions: ['inspect', 'edit'],
    hiddenColumns: ['select-item'],
  };

  public showProfile = (
    profile?: INotifyProfile,
    companyProfile?: INotifyProfile
  ) => {
    if (!profile) {
      return;
    }

    this._profilePlayerFactory.create({
      profile: { ...profile, company: companyProfile },
      baseUrl: environment.profilesUrl,
    });
  };

  public loginAsUser = (id: string, type: EnumNotifyUserType) => {
    const urls = {
      [EnumNotifyUserType.Agent]: environment.agentUrl,
      [EnumNotifyUserType.Company]: environment.companyUrl,
    };

    this._rootService
      .loginAsUser(id, type)
      .pipe(
        tap((response) => {
          window.open(`${urls[type]}/signin/force?t=${response.token}`);
        })
      )
      .subscribe();
  };
}
