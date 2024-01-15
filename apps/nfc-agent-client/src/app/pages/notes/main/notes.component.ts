import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppError, INotifyNote } from '@notify/interfaces';
import { NoteService, UtilsService } from '@notify/nfc-app-services';
import {
  ConfirmModalFactory,
  LoadingComponent,
  NotesListComponent,
  PageHeaderComponent,
} from '@notify/ngx-components';
import { Observable, Subject, catchError, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    NotesListComponent,
  ],
  providers: [NoteService, UtilsService, ConfirmModalFactory],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent implements OnInit {
  private _noteSubject$ = new Subject<INotifyNote[]>();
  public notes$: Observable<INotifyNote[]> = this._noteSubject$;

  constructor(
    private _router: Router,
    private _noteService: NoteService,
    private _confirmModal: ConfirmModalFactory,
    private _utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getNotes().subscribe();
  }

  handleHeaderAction(eventName: string) {
    if (eventName === 'addNote') {
      this._addNote();
    }
  }

  private _addNote() {
    this._noteService
      .postNote()
      .pipe(
        tap((note) => {
          this._router.navigate(['/pages/notes/inspect'], {
            queryParams: { id: note._id },
          });
        }),
        catchError(async (err: AppError) =>
          this._utilsService.errorHandler(err)
        )
      )
      .subscribe();
  }

  public getNotes() {
    return this._noteService.getNotes().pipe(
      tap((v) => {
        this._noteSubject$.next(
          v.sort((a, b) =>
            new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
          ) || null
        );
      }),
      catchError((err: AppError) => {
        return this._utilsService.errorHandler(err);
      })
    );
  }

  public editNote(id: string) {
    this._router.navigate(['/pages/notes/inspect'], {
      queryParams: { id },
    });
  }

  public deleteNote(id: string) {
    const { instance } = this._confirmModal.create({
      title: 'Elimina Nota',
      description:
        'Sei sicuro di voler eliminare questa nota? Questa azione è irreversibile.',
      confirmText: 'Elimina',
      cancelText: 'Annulla',
      confirmClass: this._confirmModal.deleteBtn,
      value: true,
    });

    instance.submitted
      .pipe(
        switchMap((r) => {
          if (!r) {
            return [];
          }
          this._noteSubject$.next([]);
          return this._noteService.deleteNote(id);
        }),
        switchMap(() => this.getNotes()),
        catchError((err: AppError) => this._utilsService.errorHandler(err)),
        tap(() => {
          instance.close();
        })
      )
      .subscribe();
  }
}
