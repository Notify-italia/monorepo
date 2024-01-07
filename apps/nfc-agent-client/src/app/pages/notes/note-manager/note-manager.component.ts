import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError, INotifyNote } from '@notify/interfaces';
import { NoteService } from '@notify/nfc-app-services';
import {
  LoadingComponent,
  NoteFormComponent,
  PageHeaderComponent,
} from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, of, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    NoteFormComponent,
    LoadingComponent,
  ],
  providers: [NoteService],
  templateUrl: './note-manager.component.html',
  styleUrl: './note-manager.component.scss',
})
export class NoteManagerComponent implements OnInit {
  public id = this._activeRoute.snapshot.queryParams['id'];

  public noteSubject$ = new Subject<INotifyNote>();
  public note$?: Observable<INotifyNote> = this.noteSubject$;

  public loading = false;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _noteService: NoteService,
    private _toastr: ToastrService
  ) {}

  handleHeaderAction(eventName: string) {
    if (eventName === 'back') {
      this._router.navigate(['/pages/notes']);
    }
  }

  ngOnInit() {
    if (!this.id) {
      return;
    }

    this._noteService
      .getNote(this.id)
      .pipe(
        tap((note) => {
          this.noteSubject$?.next(note);
        }),
        catchError((err: AppError) => {
          this._toastr.error(err.error.errors[0].message, 'Errore');

          return of(err);
        })
      )
      .subscribe();
  }

  public saveNote(note: INotifyNote) {
    this.loading = true;
    this._noteService
      .patchNote(this.id, note)
      .pipe(
        tap((note) => {
          this.loading = false;
          this.noteSubject$?.next(note);
        }),
        catchError((err: AppError) => {
          this.loading = false;
          this._toastr.error(err.error.errors[0].message, 'Errore');

          return of(err);
        })
      )
      .subscribe();
  }
}
