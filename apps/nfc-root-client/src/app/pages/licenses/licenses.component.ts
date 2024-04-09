import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { INotifyLicense } from '@notify/interfaces';
import { CustomTableCoreComponent, RootService } from '@notify/ngx-shared';
import { addMonths, format } from 'date-fns';

@Component({
  standalone: true,
  imports: [CommonModule, CustomTableCoreComponent],
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
}
