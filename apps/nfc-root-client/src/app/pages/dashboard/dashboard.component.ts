import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  EnumNotifyUserType,
  INotifyProfile,
  INotifyUser,
} from '@notify/interfaces';
import {
  AvatarComponent,
  CustomTableComponent,
  INotifyCustomTableConfig,
  LoadingComponent,
  PageHeaderComponent,
  ProfileService,
  RootService,
  WidgetCounterComponent,
} from '@notify/ngx-shared';
import { format } from 'date-fns';
import { of, switchMap, tap, timer } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    WidgetCounterComponent,
    LoadingComponent,
    PageHeaderComponent,
    AvatarComponent,
    RouterModule,
    CustomTableComponent,
  ],
  providers: [ProfileService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public profileService = inject(ProfileService);
  private _rootService = inject(RootService);
  private r = inject(Router);

  public isPolling = false;
  public dashboard$ = this._rootService.getDashboard().pipe(
    switchMap(() =>
      timer(0, 10000).pipe(
        tap(() => (this.isPolling = true)),
        switchMap(() => this._rootService.getDashboard()),
        tap(() => (this.isPolling = false))
      )
    )
  );

  public of = of;

  public getCustomerRedirectUrl(user: INotifyUser) {
    if (user.profile?.type === EnumNotifyUserType.Agent) {
      return user.owner;
    }

    return user._id;
  }

  public customTableConfig: INotifyCustomTableConfig = {
    columns: [
      {
        id: 'avatar',
        label: 'Avatar',
        hidden: () => false,
        value: {
          valueType: 'avatar',
          avatarSize: '14',
          computedValues: (iterate: { date: Date; user: INotifyUser }) => ({
            src: this.profileService.getProfileAvatar(
              iterate.user.profile as INotifyProfile
            ),
            mask: 'circle',
            backgroundColor: 'black',
            placeholderSeed: iterate.user._id,
            userName: this.profileService.getContactName(
              iterate.user.profile as INotifyProfile
            ),
            userSurname: '',
            userEmail: iterate.user.email,
          }),
        },
      },
      {
        id: 'todayVisits',
        label: 'Visite in giornata',
        hidden: () => false,
        value: {
          //transformer: (v) => format(new Date(v), 'dd/MM/yyyy HH:mm'),
          valueType: 'field',
          fieldName: 'count',
          skeletonLength: 10,
        },
      },
      {
        id: 'date',
        label: 'Ultima scansione',
        hidden: () => false,
        value: {
          transformer: (v) => format(new Date(v), 'dd/MM/yyyy HH:mm'),
          valueType: 'field',
          fieldName: 'date',
          skeletonLength: 10,
        },
      },
      {
        id: 'explore',
        label: '',
        hidden: () => false,
        value: {
          valueType: 'actions',
          actions: [
            {
              tooltip: 'Pagina del cliente',
              eventName: 'goToCustomer',
              path: [
                'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
              ],
              svgType: 'outlined',
              color: 'accent',
            },
          ],
        },
      },
    ],
    searchBar: {
      filterableFields: [
        'user.email',
        'user.profile.email',
        'user.profile.name',
        'user.profile.surname',
        'user.profile.email',
        'user.profile.phone',
        'user.profile.customFields.iconName',
        'user.profile.customFields.value',
        'user.createdAt',
        'user.profile.role',
        'user.profile.advancedProfile.pageSettings.contactOverrides.name',
        'user.profile.advancedProfile.items.label',
        'user.profile.advancedProfile.items.sublabel',
        'user.profile.advancedProfile.items.description',
        'user.profile.advancedProfile.items.items.url',
        'user.profile.advancedProfile.items.url',
        'user.profile.advancedProfile.items.items.caption',
      ],
      helpLabel: '',
    },
    skeletonRows: 5,
  };

  public handleCustomTableEvents(item: { date: Date; user: INotifyUser }) {
    this.r.navigate(['/pages/customer'], {
      queryParams: {
        id: this.getCustomerRedirectUrl(item.user),
      },
    });
  }
}
