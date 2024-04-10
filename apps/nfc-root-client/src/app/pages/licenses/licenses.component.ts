import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { INotifyLicense } from '@notify/interfaces';
import { CustomTableComponent, RootService } from '@notify/ngx-shared';
import { addMonths, format } from 'date-fns';

@Component({
  standalone: true,
  imports: [CommonModule, CustomTableComponent],
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss',
})
export class LicensesComponent {
  private _rootService = inject(RootService);

  public licenses$ = this._rootService.getLicenses({
    items: 1000,
    page: 1,
  });

  public dateTransform(date: string): string {
    if (!date) {
      return 'Senza Scadenza';
    }

    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  }

  public isExpired(iterate: INotifyLicense): boolean {
    if (!iterate.expirationDate) {
      return false;
    }

    return new Date(iterate.expirationDate) < new Date();
  }

  public isNotExpired(iterate: INotifyLicense): boolean {
    if (!iterate.expirationDate) {
      return false;
    }

    return new Date(iterate.expirationDate) > new Date();
  }

  public isExpiring(iterate: INotifyLicense): boolean {
    if (!iterate.expirationDate) {
      return false;
    }

    return (
      new Date(iterate.expirationDate) > new Date() &&
      new Date(iterate.expirationDate) < addMonths(new Date(), 1)
    );
  }

  public rowClicked(license: INotifyLicense): void {
    console.log(license);
  }

  public actionClicked(action: { event: string; data: INotifyLicense }): void {
    if (action.event === 'copy') {
      navigator.clipboard.writeText(action.data.publicKey);
    }
  }

  public sortExpirationDate(a: INotifyLicense, b: INotifyLicense): number {
    if (!a.expirationDate && !b.expirationDate) {
      return 0;
    }

    if (!a.expirationDate) {
      return 1;
    }

    if (!b.expirationDate) {
      return 1;
    }

    return (
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
    );
  }

  public sortCreationDate(a: INotifyLicense, b: INotifyLicense): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  public sortBoughtCards(a: INotifyLicense, b: INotifyLicense): number {
    return (a.boughtCards || 0) - (b.boughtCards || 0);
  }

  public sortAllowedAgents(a: INotifyLicense, b: INotifyLicense): number {
    return (a.allowedAgents || 0) - (b.allowedAgents || 0);
  }
}
