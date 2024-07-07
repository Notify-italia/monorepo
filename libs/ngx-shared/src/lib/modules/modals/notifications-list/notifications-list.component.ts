import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyNotification } from '@notify/interfaces';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  BehaviorSubject,
  combineLatest,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../constructors';
import { NotificationsService, UtilsService } from '../../../services';
import { NoItemsComponent } from '../../../standalones';
import { EnumSelectOptionStyle, SelectModalFactory } from '../select';

@Component({
  selector: 'notify-notifications-list',
  standalone: true,
  imports: [CommonModule, NoItemsComponent, InfiniteScrollModule],
  providers: [
    ...baseModalComponentProviders,
    NotificationsService,
    UtilsService,
    SelectModalFactory,
  ],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent
  extends ModalBaseComponent
  implements OnInit
{
  public domSanitizer = inject(DomSanitizer);
  private _notificationsService = inject(NotificationsService);
  private _utilsService = inject(UtilsService);
  private _selectModalFactory = inject(SelectModalFactory);

  public selectedOption: 'all' | 'unread' | 'read' = 'unread';

  public currentChunk$ = new BehaviorSubject<number>(1);
  public notificationsSubject$ = new Subject<INotifyNotification[]>();
  public notifications$ = combineLatest([
    this.currentChunk$,
    this.notificationsSubject$,
  ]).pipe(
    switchMap(([chunk, noti]) => of(noti.slice(0, chunk * this.chunkSize)))
  );

  public currentChunk = 1;
  public chunkSize = 10;

  public ngOnInit() {
    this.refreshNotifications().subscribe();
  }

  public loadNextChunk() {
    this.currentChunk$.next(this.currentChunk$.value + 1);
  }

  public getTemporalDelta(date: string) {
    return this._utilsService.getTemporalDelta(new Date(date));
  }

  public refreshNotifications() {
    return this._notificationsService
      .getNotifications(this.selectedOption)
      .pipe(tap((v) => this.notificationsSubject$.next(v)));
  }

  public notificationClicked(notification: INotifyNotification) {
    this._selectModalFactory.create({
      title: notification.title,
      subtitle: notification.subtitle,
      hideCancel: !notification.actions.length,
      options: notification.actions.length
        ? notification.actions.map((a) => ({
            label: a.title,
            value: a.id,
          }))
        : [
            {
              label: 'Ok',
              value: 'mark-as-read',
              style: EnumSelectOptionStyle.CANCEL,
            },
          ],
    });
  }
}
