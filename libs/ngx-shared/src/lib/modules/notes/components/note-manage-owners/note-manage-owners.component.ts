import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { INotifyUser } from '@notify/interfaces';
import { AuthService } from '@notify/ngx-shared';
import { Observable, Subject } from 'rxjs';
import { LoadingComponent } from '../../../../standalones/loading/loading.component';
import { AccountsTableComponent } from '../../../accounts';
import { NoteAddOwnerComponent } from '../note-add-owner/note-add-owner.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent, AccountsTableComponent],

  templateUrl: './note-manage-owners.component.html',
  styleUrl: './note-manage-owners.component.scss',
})
export class NoteManageOwnersComponent implements OnInit {
  @Input() users$!: Observable<INotifyUser[]>;
  @Input() skeletonRows = 0;
  @Input() cf!: ComponentRef<NoteAddOwnerComponent>;

  @Output() removeOwner = new Subject<string>();
  @Output() addOwner = new Subject<void>();

  @Output() destroyed$ = new Subject<void>();

  public currentUser = inject(AuthService).user?._id;

  public loading = false;

  public usersSubject$ = new Subject<INotifyUser[]>();

  public ngOnInit() {
    this.refreshUserSubject();
  }

  public close() {
    this.cf.destroy();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public refreshUserSubject(observable$?: Observable<INotifyUser[]>) {
    (observable$ || this.users$).subscribe((users) =>
      this.usersSubject$.next(users)
    );
  }
}
