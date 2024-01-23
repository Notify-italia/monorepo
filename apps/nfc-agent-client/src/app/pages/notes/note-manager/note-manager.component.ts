import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError, INotifyNote, INotifyUser } from '@notify/interfaces';
import {
  AgentService,
  NoteService,
  UtilsService,
} from '@notify/nfc-app-services';
import {
  AddNoteOwnerFactory,
  ConfirmModalFactory,
  LoadingComponent,
  NoteDetailComponent,
  PageHeaderComponent,
  SvgBoxIconComponent,
} from '@notify/ngx-components';
import { Observable, Subject, catchError, map, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    NoteDetailComponent,
    SvgBoxIconComponent,
  ],
  providers: [
    NoteService,
    UtilsService,
    ConfirmModalFactory,
    AddNoteOwnerFactory,
    AgentService,
  ],
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
    private _utilsService: UtilsService,
    private _confirmModal: ConfirmModalFactory,
    private _agentService: AgentService,
    private _addNoteOwner: AddNoteOwnerFactory
  ) {}

  goBack() {
    this._router.navigate(['/pages/notes']);
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
        catchError((err: AppError) => this._utilsService.errorHandler(err))
      )
      .subscribe();
  }

  public saveNote(note: INotifyNote) {
    this.loading = true;
    this._noteService
      .patchNote(this.id, note)
      .pipe(
        tap((note) => {
          this.noteSubject$?.next(note);
        }),
        catchError((err: AppError) => this._utilsService.errorHandler(err)),
        tap(() => (this.loading = false))
      )
      .subscribe();
  }

  public addOwner(note: INotifyNote) {
    const agents$ = this._agentService.getAgents().pipe(
      map((agents) =>
        agents.filter((agent) => {
          return !note?.owners?.includes(agent._id);
        })
      )
    ) as Observable<INotifyUser[]>;

    const ref = this._addNoteOwner.create({
      users$: agents$,
    });

    return ref;
  }

  public deleteNote() {
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

          this.loading = true;
          return this._noteService.deleteNote(this.id);
        }),
        tap(() => {
          this.goBack();
        }),
        catchError((err: AppError) => this._utilsService.errorHandler(err)),
        tap(() => {
          this.loading = false;
          instance.close();
        })
      )
      .subscribe();
  }
}
