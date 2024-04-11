import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EnumNotifyUserType,
  INotifyAgent,
  INotifyCompany,
  INotifyLicense,
  INotifyProfile,
} from '@notify/interfaces';
import {
  AccountsTableComponent,
  AppTitleComponent,
  IAccountsTableConfig,
  LicenseFormFullFactory,
  LicenseInfoComponent,
  LoadingComponent,
  ProfilePlayerFactory,
  ProfileViewComponent,
  RootService,
} from '@notify/ngx-shared';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, map, of, switchMap, tap } from 'rxjs';
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
  providers: [ProfilePlayerFactory, LicenseFormFullFactory],
  templateUrl: './inspect-customer.component.html',
  styleUrl: './inspect-customer.component.scss',
})
export class InspectCustomerComponent {
  private _rootService = inject(RootService);
  private _activatedRoute = inject(ActivatedRoute);
  private _profilePlayerFactory = inject(ProfilePlayerFactory);
  private _licenseFormFull = inject(LicenseFormFullFactory);
  private _toastr = inject(ToastrService);

  public userTypes = EnumNotifyUserType;

  public customerSubject$ = new Subject<
    INotifyCompany<true> & {
      users: INotifyAgent[];
      users$: Observable<INotifyAgent[]>;
    }
  >();
  public customer$: Observable<
    INotifyCompany<true> & {
      users: INotifyAgent[];
      users$: Observable<INotifyAgent[]>;
    }
  > = this.customerSubject$;

  public tableConfig: IAccountsTableConfig = {
    allowedActions: ['inspect', 'edit'],
    hiddenColumns: ['select-item'],
  };

  constructor() {
    this._getCustomer();
  }

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

  public openLicenseForm(
    license: INotifyLicense,
    company: INotifyCompany<true>
  ): void {
    const ref = this._licenseFormFull.create({
      ...license,
      company,
    });

    ref.instance.deleteLicense
      .pipe(
        switchMap((v) => this._rootService.deleteLicense(v)),
        tap(() => {
          this._toastr.warning('Licenza eliminata');
          this._getCustomer();
        })
      )
      .subscribe();

    ref.instance.submitted
      .pipe(
        switchMap((v) =>
          this._rootService.patchLicense(v, license._id).pipe(
            tap(() => {
              this._toastr.success('Licenza modificata');
            })
          )
        ),
        tap(() => this._getCustomer())
      )
      .subscribe();
  }

  private _getCustomer(): void {
    this._rootService
      .getCustomer(
        this._activatedRoute.snapshot.queryParamMap.get('id') as string
      )
      .pipe(
        map((customer) => {
          return {
            ...customer,
            users$: of(customer.users),
          };
        }),
        tap((customer) => {
          this.customerSubject$.next(customer);
        })
      )
      .subscribe();
  }
}
