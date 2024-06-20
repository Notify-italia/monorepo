import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { INotifyUser } from '@notify/interfaces';
import {
  AccountsTableComponent,
  IAccountsTableConfig,
  INotifyCustomTableConfig,
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
    allowedActions: [],
    clickableRow: true,
    hiddenColumns: ['select-item', 'role', 'actions'],
  };

  public get customersColumns(): INotifyCustomTableConfig['columns'] {
    return [
      {
        id: 'boughtCards',
        label: 'Tessere Possedute',
        hidden: () => false,
        sorter: (a, b) => a.license?.boughtCards - b.license?.boughtCards,
        value: {
          valueType: 'badge',
          minWidth: 0,
          style: [
            {
              condition: () => true,
              bg: '#8E6CD0',
              text: 'white',
            },
          ],
          fieldName: 'license.boughtCards',
          transformer: (value) => value || '0',
        },
      },
    ];
  }

  public inspectCustomer(id: string) {
    this._router.navigate(['/pages/customer'], { queryParams: { id } });
  }
}
