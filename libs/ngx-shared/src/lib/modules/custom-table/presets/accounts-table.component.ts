import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  INotifyAPAvatarItem,
  INotifyAccount,
  INotifyAgent,
  INotifyCompany,
  INotifyUser,
} from '@notify/interfaces';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { CustomTableComponent, INotifyCustomTableConfig } from '..';
import { ICTActionsValue } from '../core/parts/ct-actions-value.part.component';
import { ICTAvatarValue } from '../core/parts/ct-avatar-value.part.component';
import { ICTBadgevalue } from '../core/parts/ct-badge-value.part.component';
import { ICTFieldValue } from '../core/parts/ct-field-value.part.component';

export type IAccountsTableRow =
  | 'name'
  | 'createdAt'
  | 'role'
  | 'select-item'
  | 'actions';

type AllowedAction =
  | 'editUser'
  | 'personalizeUser'
  | 'deleteUser'
  | 'inspectUser'
  | 'inspectAnalytics';

export interface IAccountsTableConfig {
  displayLeftAccounts?: boolean;
  hiddenColumns?: IAccountsTableRow[];
  clickableRow?: boolean;
  transparentBackgroundColor?: boolean;
  allowedActions?: AllowedAction[];
}

@Component({
  selector: 'notify-accounts-table',
  standalone: true,
  imports: [CommonModule, CustomTableComponent],
  template: `
    <div class="flex flex-col">
      <div class="w-full flex justify-end px-4 -mb-10" *ngIf="maxAgents">
        <div class="badge badge-info font-medium text-xs">
          {{ maxAgents }} Accounts gestibili
        </div>
      </div>

      <notify-custom-table
        *ngIf="customTableConfig as c"
        class="!w-full h-full "
        [iterable$]="users$"
        [config]="c"
        (rowClick)="rowClicked.emit($event)"
        [noItemsMessages]="noItemsMessages"
        (actionClicked)="emitAction($event.event, $event.data)"
      ></notify-custom-table>
    </div>
  `,
})
export class AccountsTableComponent implements OnInit, OnChanges {
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

  public customTableConfig?: INotifyCustomTableConfig;

  public get iterableSkeletonRows(): number[] {
    return new Array(this.skeletonRows).map((_, i) => i);
  }

  ngOnInit(): void {
    this.customTableConfig = this._generateCustomTableConfig();
  }

  ngOnChanges(): void {
    this.customTableConfig = this._generateCustomTableConfig();
  }

  @Output() public inspectUser = new EventEmitter<INotifyAccount>();
  @Output() public editUser = new EventEmitter<INotifyAccount>();
  @Output() public deleteUser = new EventEmitter<INotifyAccount>();
  @Output() public rowClicked = new EventEmitter<INotifyAccount>();
  @Output() public editProfile = new EventEmitter<INotifyAccount>();
  @Output() public inspectAnalytics = new EventEmitter<INotifyAccount>();

  public users: INotifyAccount[] | null = null;

  private _isRowDisabled(row: IAccountsTableRow): boolean {
    return this.config.hiddenColumns?.includes(row) || false;
  }

  public emitAction(event: string, data: unknown): void {
    (this[event as keyof AccountsTableComponent] as EventEmitter<unknown>).emit(
      data
    );
  }

  private _generateCustomTableConfig(): INotifyCustomTableConfig {
    return {
      skeletonRows: this.skeletonRows,
      clickableRows: this.config.clickableRow,
      defaultSorter: 'name',
      style: {
        transparentBackground: this.config.transparentBackgroundColor,
        alternateRows: true,
      },
      searchBar: {
        filterableFields: [
          'email',
          'profile.email',
          'profile.name',
          'profile.surname',
          'profile.email',
          'profile.phone',
          'profile.customFields.iconName',
          'profile.customFields.value',
          'createdAt',
          'profile.role',
        ],
        helpLabel: '',
      },
      columns: [
        {
          id: 'name',
          label: 'Alias',
          hidden: () => this._isRowDisabled('name'),
          sorter: (a, b) => a.profile?.name?.localeCompare(b.profile?.name),
          value: <ICTAvatarValue>{
            valueType: 'avatar',
            avatarSize: '14',
            scrambleCacheOnChange: false,
            computedValues: this._computeAvatar,
          },
        },
        {
          id: 'createdAt',
          label: 'Data di Creazione',
          hidden: () => this._isRowDisabled('createdAt'),
          sorter: (a: INotifyUser, b: INotifyUser) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          value: <ICTFieldValue>{
            valueType: 'field',
            skeletonLength: 10,
            fieldName: 'createdAt',
            transformer: (value) => format(new Date(value), 'dd/MM/yyyy HH:mm'),
          },
        },
        {
          id: 'role',
          label: 'Ruolo',
          hidden: () => this._isRowDisabled('role'),
          sorter: (a, b) => a.profile.role.localeCompare(b.profile.role),
          value: <ICTBadgevalue>{
            valueType: 'badge',
            fieldName: 'profile.role',
            minWidth: 10,
            style: [
              {
                condition: () => true,
                text: '#ffffff',
                bg: '#8E6CD0',
              },
            ],
          },
        },
        {
          id: 'actions',
          label: '',
          hidden: () => this._isRowDisabled('actions'),
          value: <ICTActionsValue>{
            valueType: 'actions',
            actions: [
              {
                svgType: 'solid',
                tooltip: 'Visualizza Profilo',
                path: [
                  'M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z',
                ],
                color: 'primary',
                eventName: 'inspectUser',
              },
              {
                svgType: 'outlined',
                tooltip: 'Mostra Analytics',
                path: [
                  'M16.5 6.75h5.25V12',
                  'm2.25 17.25 5.69-5.69a1.5 1.5 0 0 1 2.12 0l2.38 2.38a1.5 1.5 0 0 0 2.12 0L21 7.5',
                ],
                color: 'netural',
                eventName: 'inspectAnalytics',
              },
              {
                svgType: 'solid',
                tooltip: 'Modifica Utente',
                path: [
                  'M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z',
                ],
                color: 'info',
                eventName: 'editUser',
              },
              {
                svgType: 'solid',
                tooltip: 'Personalizza Profilo',
                path: [
                  'M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5A3.75 3.75 0 0 0 3 17.25a1.5 1.5 0 0 1-1.601 1.497.75.75 0 0 0-.7 1.123 5.25 5.25 0 0 0 9.8-2.62 3.75 3.75 0 0 0-3.75-3.75Z',
                ],
                color: 'warning',
                eventName: 'editProfile',
              },
              {
                tooltip: 'Elimina Utente',
                svgType: 'solid',
                path: [
                  'M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z',
                ],
                color: 'error',
                eventName: 'deleteUser',
              },
            ].filter((action) => {
              if (!this.config.allowedActions?.length) {
                return true;
              }

              return this.config.allowedActions.includes(
                action.eventName as AllowedAction
              );
            }),
          },
        },
      ],
    };
  }

  private _computeAvatar(row: unknown) {
    const company = (row as INotifyUser)?.profile;

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
      userEmail: (row as INotifyUser)?.email || '',
    };
  }
}
