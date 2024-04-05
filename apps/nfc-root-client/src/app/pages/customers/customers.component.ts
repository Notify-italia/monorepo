import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { INotifyUser } from '@notify/interfaces';
import {
  AccountsTableComponent,
  IAccountsTableConfig,
  RootService,
} from '@notify/ngx-shared';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, AccountsTableComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private _rootService = inject(RootService);
  private _router = inject(Router);

  public customers$ = this._rootService.getCustomers({
    page: 1,
    items: 100,
  }) as unknown as Observable<INotifyUser[]>;
  public tableConfig: IAccountsTableConfig = {
    allowedActions: ['inspect', 'delete'],
    hiddenColumns: ['select-item', 'role'],
  };

  public inspectCustomer(id: string) {
    this._router.navigate(['/pages/customer'], { queryParams: { id } });
  }
}
