import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INotifyAgent } from '@notify/interfaces';
import { AvatarComponent } from '../../../../standalones/avatar/avatar.component';
import {
  IAccountsTableConfig,
  IAccountsTableRow,
} from '../accounts-table/accounts-table.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[notify-accounts-row]',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './accounts-row.component.html',
  styleUrls: ['./accounts-row.component.scss'],
})
export class AccountsRowComponent {
  @Input({ required: true }) public user!: INotifyAgent;
  @Input() public config: IAccountsTableConfig = {
    allowedActions: ['inspect', 'edit', 'delete', 'analytics', 'personalize'],
    displayLeftAccounts: true,
    hiddenColumns: [],
  };

  @Output() public inspectUser = new EventEmitter<void>();
  @Output() public editProfile = new EventEmitter<void>();
  @Output() public editUser = new EventEmitter<void>();
  @Output() public deleteUser = new EventEmitter<void>();
  @Output() public inspectAnalytics = new EventEmitter<void>();

  public placeholderAvatar =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';

  public isRowDisabled(row: IAccountsTableRow): boolean {
    return this.config.hiddenColumns?.includes(row) || false;
  }

  public isActionAllowed(action: IAccountsTableConfig['allowedActions'][0]) {
    return this.config.allowedActions?.includes(action) || false;
  }
}
