import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyAgent, INotifyProfile } from '@notify/interfaces';
import { AccountsRowComponent } from '../accounts-row/accounts-row.component';

export type IAccountsTableRow =
  | 'name'
  | 'createdAt'
  | 'role'
  | 'select-item'
  | 'actions';

export interface IAccountsTableConfig {
  allowDelete?: boolean;
  allowEdit?: boolean;
  allowInspect?: boolean;
  displayLeftAccounts?: boolean;
  disabledRows?: IAccountsTableRow[];
  clickableRow?: boolean;
}

@Component({
  selector: 'notify-accounts-table',
  standalone: true,
  imports: [CommonModule, AccountsRowComponent],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss'],
})
export class AccountsTableComponent {
  @Input() public users: INotifyAgent[] = [];
  @Input() public maxAgents: number | null = null;
  @Input({ required: true }) public config!: IAccountsTableConfig;

  @Output() public inspectProfile = new EventEmitter<INotifyProfile>();
  @Output() public showUserForm = new EventEmitter<INotifyAgent>();
  @Output() public deleteUser = new EventEmitter<INotifyAgent>();
  @Output() public rowClicked = new EventEmitter<INotifyAgent>();

  public isRowDisabled(row: IAccountsTableRow): boolean {
    return this.config.disabledRows?.includes(row) || false;
  }
}
