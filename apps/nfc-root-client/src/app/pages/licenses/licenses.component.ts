import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  INotifyAPAvatarItem,
  INotifyPopulatedLicense,
} from '@notify/interfaces';
import {
  CustomTableComponent,
  LicenseFormFullFactory,
  RootService,
} from '@notify/ngx-shared';
import { addMonths, format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, CustomTableComponent],
  providers: [LicenseFormFullFactory],
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss',
})
export class LicensesComponent implements OnInit {
  private _rootService = inject(RootService);
  private _licenseFormFull = inject(LicenseFormFullFactory);
  private _toastr = inject(ToastrService);

  public licensesSubject$ = new Subject<INotifyPopulatedLicense[]>();
  public licenses$: Observable<INotifyPopulatedLicense[]> =
    this.licensesSubject$;

  public hidden() {
    return false;
  }

  public openLicenseForm(license?: INotifyPopulatedLicense): void {
    const ref = license
      ? this._licenseFormFull.create(license)
      : this._licenseFormFull.create();

    ref.instance.deleteLicense
      .pipe(
        switchMap((v) => this._rootService.deleteLicense(v)),
        tap(() => {
          this._toastr.warning('Licenza eliminata');
          this._getLicenses();
        })
      )
      .subscribe();

    ref.instance.submitted
      .pipe(
        switchMap((v) =>
          license
            ? this._rootService.patchLicense(v, license._id).pipe(
                tap(() => {
                  this._toastr.success('Licenza modificata');
                })
              )
            : this._rootService.postLicense(v).pipe(
                tap((v) => {
                  navigator.clipboard.writeText(v.publicKey);
                  this._toastr.success('Chiave copiata negli appunti');
                })
              )
        ),
        tap(() => this._getLicenses())
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this._getLicenses();
  }

  private _getLicenses(): void {
    this._rootService.getLicenses({ items: 1000, page: 1 }).subscribe((v) => {
      this.licensesSubject$.next(v);
    });
  }

  public dateTransform(date: string): string {
    if (!date) {
      return 'Senza Scadenza';
    }

    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  }

  public numberTransform(value: number): string {
    if (!value) {
      return '0';
    }
    return value.toString();
  }

  public booleanTransform(value: boolean): string {
    return value ? '✅' : '❌';
  }

  public isExpired(iterate: INotifyPopulatedLicense): boolean {
    if (!iterate.expirationDate) {
      return false;
    }

    return new Date(iterate.expirationDate) < new Date();
  }

  public isNotExpired(iterate: INotifyPopulatedLicense): boolean {
    if (!iterate.expirationDate) {
      return false;
    }

    return new Date(iterate.expirationDate) > new Date();
  }

  public isExpiring(iterate: INotifyPopulatedLicense): boolean {
    if (!iterate.expirationDate) {
      return false;
    }

    return (
      new Date(iterate.expirationDate) > new Date() &&
      new Date(iterate.expirationDate) < addMonths(new Date(), 1)
    );
  }

  public rowClicked(license: INotifyPopulatedLicense): void {
    this.openLicenseForm(license);
  }

  public actionClicked(action: {
    event: string;
    data: INotifyPopulatedLicense;
  }): void {
    if (action.event === 'copyPublicKey') {
      navigator.clipboard.writeText(action.data.publicKey);
      this._toastr.info('Chiave copiata negli appunti');
    }
  }

  public computeAvatar(row: unknown) {
    const company = (row as INotifyPopulatedLicense).company?.profile;

    if (!company?.advancedProfile?.enabled) {
      return {
        src: company?.avatar || '',
        mask: company?.config.avatarMask || '',
        backgroundColor: company?.config.avatarMask
          ? company?.colors.elements
          : 'transparent',
        placeholderSeed: company?._id || '',
        userName: company?.name || '',
        userSurname: company?.surname || '',
        userEmail: company?.email || '',
        size: '14',
      };
    }

    const avatar = company.advancedProfile.items.find(
      (v) => v._id === company.advancedProfile?.requiredItems.avatar
    ) as INotifyAPAvatarItem;
    return {
      src: avatar?.imgSrc || '',
      mask: avatar.imgMask || '',
      backgroundColor: 'transparent',
      placeholderSeed: company?._id || '',
      userName: avatar.label || '',
      userSurname: '',
      size: '14',
      userEmail: (row as INotifyPopulatedLicense).company?.email || '',
    };
  }

  public sortExpirationDate(
    a: INotifyPopulatedLicense,
    b: INotifyPopulatedLicense
  ): number {
    if (!a.expirationDate) {
      return 1;
    }

    if (!b.expirationDate) {
      return -1;
    }

    return (
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
    );
  }

  public sortCreationDate(
    a: INotifyPopulatedLicense,
    b: INotifyPopulatedLicense
  ): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  public sortBoughtCards(
    a: INotifyPopulatedLicense,
    b: INotifyPopulatedLicense
  ): number {
    return (a.boughtCards || 0) - (b.boughtCards || 0);
  }

  public sortAllowedAgents(
    a: INotifyPopulatedLicense,
    b: INotifyPopulatedLicense
  ): number {
    return (a.allowedAgents || 0) - (b.allowedAgents || 0);
  }

  public sortAssignedTo(
    a: INotifyPopulatedLicense,
    b: INotifyPopulatedLicense
  ): number {
    const aName = a.company?.profile?.name || '';
    const bName = b.company?.profile?.name || '';

    if (!aName) {
      return 1;
    }
    if (!bName) {
      return -1;
    }
    return aName.localeCompare(bName);
  }
}
