import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  EnumNotificationTypes,
  EnumNotifyNotificationActionEvents,
  INotifyNotification,
  UnknownType,
} from '@notify/interfaces';
import { Observable, of, switchMap, tap } from 'rxjs';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../constructors';
import { LeadsService, NotificationsService } from '../../../services';
import {
  EnumSelectOptionStyle,
  ISelectOption,
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
    [isClosing]="isClosing"
  ></notify-select>`,
})
export class InspectNotificationComponent extends ModalBaseComponent {
  private _notificationsService = inject(NotificationsService);
  private _leadsService = inject(LeadsService);
  private _Router = inject(Router);

  @Input() notification!: INotifyNotification;

  @Output() refreshNotifications = new EventEmitter<void>();
  @Output() closeParent = new EventEmitter<void>();

  public get selectConfig() {
    return {
      title: this.notification.title,
      subtitle: this.notification.subtitle,
      hideCancel:
        !this.notification.actions.length ||
        this.notification.read ||
        this.notification.actions.some(
          (a) =>
            a.eventName ===
            EnumNotifyNotificationActionEvents.NotificationEventIgnore
        ),
      readOnly:
        this.notification.read &&
        this.notification.notificationType ===
          EnumNotificationTypes.ActionRequired,
      options: this.notification.actions.length
        ? this.notification.actions.map((a) => {
            const isSelected =
              a.id === this.notification.selectedAction &&
              this.notification.notificationType ===
                EnumNotificationTypes.ActionRequired;

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
    this._capacitorService.triggerHapticFeedback(
      this._capacitorService.hFeedbackStyles.Light
    );
    of(submitted)
      .pipe(
        switchMap((v) => {
          if (!v.value) {
            return of(v);
          }

          if (this.notification.read) {
            return of(v);
          }

          if (v.value === 'mark-as-read') {
            return this._notificationsService
              .patchNotification(this.notification._id, {
                read: true,
              })
              .pipe(switchMap(() => of(v)));
          }

          return this._notificationsService
            .patchNotification(this.notification._id, {
              read: true,
              selectedAction: v.value,
            })
            .pipe(switchMap(() => of(v)));
        }),
        switchMap((v) => this._performAction(v)),
        tap(() => this.refreshNotifications.emit()),
        tap(() => this.close())
      )
      .subscribe();
  }

  private _performAction(
    selectedAction: ISelectOption
  ): Observable<UnknownType> {
    const action = this.notification.actions.find(
      (a) => a.id === selectedAction.value
    );

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
      case EnumNotifyNotificationActionEvents.NotificationEventIgnore: {
        return of(true);
      }
      case EnumNotifyNotificationActionEvents.LeadsRouteDetail: {
        return of(true).pipe(
          tap(() => {
            this._Router.navigate(['/pages/leads/inspect'], {
              queryParams: { l: action.data.id },
            });
            this.close();
            this.closeParent.emit();
          })
        );
      }
      default: {
        return of();
      }
    }
  }
}
