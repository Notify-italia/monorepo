import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { INotifyUser } from '@notify/interfaces';

import { Observable, Subject } from 'rxjs';
import { ModalBaseComponent } from '../../../../constructors/modal.base.component';
import { AuthService } from '../../../../services';
import { LoadingComponent } from '../../../../standalones/loading/loading.component';
import { AccountsTableComponent } from '../../../custom-table/presets';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent, AccountsTableComponent],
  templateUrl: './note-manage-owners.component.html',
})
export class NoteManageOwnersComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input() users$!: Observable<INotifyUser[]>;
  @Input() skeletonRows = 0;

  @Output() removeOwner = new Subject<string>();
  @Output() addOwner = new Subject<void>();

  public currentUser = inject(AuthService).user?._id;

  public loading = false;

  public usersSubject$ = new Subject<INotifyUser[]>();

  public ngOnInit() {
    this.refreshUserSubject();
  }

  public refreshUserSubject(observable$?: Observable<INotifyUser[]>) {
    (observable$ || this.users$).subscribe((users) =>
      this.usersSubject$.next(users)
    );
  }
}
