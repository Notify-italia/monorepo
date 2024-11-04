import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyNotification } from '@notify/interfaces';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  BehaviorSubject,
  combineLatest,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  baseModalComponentProviders,
  ModalBaseComponent,
} from '../../../constructors';
import { NotificationsService, UtilsService } from '../../../services';
import { NoItemsComponent } from '../../../standalones';
import { InspectNotificationFactory } from '../inspect-notification';

@Component({
  selector: 'notify-notifications-list',
  standalone: true,
  imports: [CommonModule, NoItemsComponent, InfiniteScrollModule],
  providers: [
    ...baseModalComponentProviders,
    NotificationsService,
    UtilsService,
    InspectNotificationFactory,
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
  private _inspectNotification = inject(InspectNotificationFactory);

  @Output() refreshNotificationsCount = new EventEmitter<void>();

  public selectedOption: 'all' | 'unread' | 'read' = 'all';

  public currentChunk$ = new BehaviorSubject<number>(1);
  public notificationsSubject$ = new Subject<INotifyNotification[]>();
  public notifications$ = combineLatest([
    this.currentChunk$,
    this.notificationsSubject$,
  ]).pipe(
    switchMap(([chunk, noti]) => of(noti.slice(0, chunk * this.chunkSize)))
  );

  public currentChunk = 1;
  public chunkSize = 15;
  public skeletonArray = new Array(this.chunkSize);

  override onInit() {
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
    const { instance } = this._inspectNotification.create({ notification });

    this._capacitorService.itemClickedHapticFeedback();

    instance.refreshNotifications
      .pipe(
        takeUntil(instance.destroyed$),
        switchMap(() => this.refreshNotifications()),
        tap(() => this.refreshNotificationsCount.emit())
      )
      .subscribe();

    instance.closeParent
      .pipe(
        takeUntil(instance.destroyed$),
        tap(() => this.close())
      )
      .subscribe();
  }

  public handleCloseButtonClick() {
    this._capacitorService.itemClickedHapticFeedback();
    this.close();
  }
}
