import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  EnumNotifyNotificationActionEvents,
  INotifyNotification,
} from '@notify/interfaces';
import { of, switchMap, tap } from 'rxjs';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../constructors';
import { LeadsService, NotificationsService } from '../../../services';
import {
  EnumSelectOptionStyle,
  ISelectOption,
  SELECT_MODAL_TIMEOUT,
  SelectComponent,
} from '../select';

@Component({
  standalone: true,
  imports: [CommonModule, SelectComponent],
  providers: [
    NotificationsService,
    ...baseModalComponentProviders,
    LeadsService,
  ],
  template: ` <notify-select
    [cf]="cf"
    [title]="selectConfig.title"
    [subtitle]="selectConfig.subtitle"
    [options]="selectConfig.options"
    [readOnly]="selectConfig.readOnly"
    [hideCancel]="selectConfig.hideCancel"
    (optionSelected)="handleSubmitted($event)"
  ></notify-select>`,
})
export class InspectNotificationComponent extends ModalBaseComponent {
  private _notificationsService = inject(NotificationsService);
  private _leadsService = inject(LeadsService);

  @Input() notification!: INotifyNotification;

  @Output() refreshNotifications = new EventEmitter<void>();

  public get selectConfig() {
    return {
      title: this.notification.title,
      subtitle: this.notification.subtitle,
      hideCancel: !this.notification.actions.length || this.notification.read,
      readOnly: this.notification.read,
      options: this.notification.actions.length
        ? this.notification.actions.map((a) => {
            const isSelected = a.id === this.notification.selectedAction;

            return {
              label: a.title,
              value: a.id,
              style: isSelected
                ? EnumSelectOptionStyle.PREFERRED
                : EnumSelectOptionStyle.DEFAULT,
            };
          })
        : [
            {
              label: 'Ok',
              value: 'mark-as-read',
              style: this.notification.read
                ? EnumSelectOptionStyle.PREFERRED
                : EnumSelectOptionStyle.DEFAULT,
            },
          ],
    };
  }

  public handleSubmitted(submitted: ISelectOption) {
    of(submitted)
      .pipe(
        switchMap((v) => {
          if (!v.value) {
            return of();
          }

          if (v.value === 'mark-as-read') {
            return this._notificationsService.patchNotification(
              this.notification._id,
              {
                read: true,
              }
            );
          }
          return this._performAction(this.notification, v).pipe(
            switchMap(() =>
              this._notificationsService.patchNotification(
                this.notification._id,
                {
                  read: true,
                  selectedAction: v.value,
                }
              )
            )
          );
        }),
        tap(() => this.refreshNotifications.emit()),
        tap(() =>
          this.close({
            timeout: SELECT_MODAL_TIMEOUT,
          })
        )
      )
      .subscribe();
  }

  private _performAction(
    noti: INotifyNotification,
    selectedAction: ISelectOption
  ) {
    const action = noti.actions.find((a) => a.id === selectedAction.value);

    if (!action) {
      return of();
    }

    switch (action.eventName) {
      case EnumNotifyNotificationActionEvents.ContactFormLeadAccept: {
        return this._leadsService.patchLead({
          _id: action.data.leadId,
          accepted: true,
        });
      }
      case EnumNotifyNotificationActionEvents.ContactFormLeadReject: {
        return this._leadsService.patchLead({
          _id: action.data.leadId,
          accepted: false,
          deleted: true,
        });
      }
      default: {
        return of();
      }
    }
  }
}
