import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  INotifyAccount,
  INotifyAgent,
  INotifyCompany,
} from '@notify/interfaces';
import { Observable } from 'rxjs';
import { LoadingComponent } from '../../../../standalones/loading/loading.component';
import { NoItemsComponent } from '../../../../standalones/no-items/no-items.component';
import { SearchBarComponent } from '../../../../standalones/search-bar/search-bar.component';
import { AccountsRowComponent } from '../accounts-row/accounts-row.component';

export type IAccountsTableRow =
  | 'name'
  | 'createdAt'
  | 'role'
  | 'select-item'
  | 'actions';

export interface IAccountsTableConfig {
  displayLeftAccounts?: boolean;
  hiddenColumns?: IAccountsTableRow[];
  clickableRow?: boolean;
  transparentBackgroundColor?: boolean;
  allowedActions: (
    | 'edit'
    | 'personalize'
    | 'delete'
    | 'inspect'
    | 'analytics'
  )[];
}

@Component({
  selector: 'notify-accounts-table',
  standalone: true,
  imports: [
    CommonModule,
    AccountsRowComponent,
    SearchBarComponent,
    LoadingComponent,
    NoItemsComponent,
  ],
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss'],
})
export class AccountsTableComponent {
  @Input({ required: true }) public users$!: Observable<
    (INotifyAgent | INotifyCompany)[]
  >;
  @Input() public maxAgents: number | null = null;
  @Input({ required: true }) public config!: IAccountsTableConfig;
  @Input() public noItemsMessages = {
    title: 'Nessun Utente',
    subtitle: 'Non ci sono utenti da mostrare',
  };
  @Input() public skeletonRows = 0;

  public get iterableSkeletonRows(): number[] {
    return new Array(this.skeletonRows).map((_, i) => i);
  }

  @Output() public inspectUser = new EventEmitter<INotifyAccount>();
  @Output() public showUserForm = new EventEmitter<INotifyAccount>();
  @Output() public deleteUser = new EventEmitter<INotifyAccount>();
  @Output() public rowClicked = new EventEmitter<INotifyAccount>();
  @Output() public editProfile = new EventEmitter<INotifyAccount>();
  @Output() public inspectAnalytics = new EventEmitter<INotifyAccount>();

  public users: INotifyAccount[] | null = null;

  public isRowDisabled(row: IAccountsTableRow): boolean {
    return this.config.hiddenColumns?.includes(row) || false;
  }
}
