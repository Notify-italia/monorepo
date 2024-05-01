import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError, INotifyNote, INotifyUser } from '@notify/interfaces';
import {
  AddNoteOwnerFactory,
  AgentService,
  AuthService,
  CompanyService,
  ConfirmModalFactory,
  LoadingComponent,
  ManageNoteOwnersFactory,
  NoteDetailComponent,
  NoteService,
  PageHeaderComponent,
  PullToRefreshComponent,
  SvgBoxIconComponent,
  UtilsService,
} from '@notify/ngx-shared';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    NoteDetailComponent,
    SvgBoxIconComponent,
    PullToRefreshComponent,
  ],
  providers: [
    NoteService,
    UtilsService,
    ConfirmModalFactory,
    AddNoteOwnerFactory,
    AgentService,
    ManageNoteOwnersFactory,
    CompanyService,
  ],
  templateUrl: './note-manager.component.html',
  styleUrl: './note-manager.component.scss',
})
export class NoteManagerComponent implements OnInit, OnDestroy {
  public id = this._activeRoute.snapshot.queryParams['id'];

  public noteSubject$ = new Subject<INotifyNote>();
  public note$?: Observable<INotifyNote> = this.noteSubject$.pipe();

  private _destroy$ = new Subject<void>();

  public loading = false;
  public playerUrl = environment.profilesUrl;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _noteService: NoteService,
    private _utilsService: UtilsService,
    private _confirmModal: ConfirmModalFactory,
    private _agentService: AgentService,
    private _addNoteOwner: AddNoteOwnerFactory,
    private _manageNoteOwners: ManageNoteOwnersFactory,
    private _authService: AuthService,
    private _companyService: CompanyService
  ) {}

  goBack() {
    this._router.navigate(['/pages/notes']);
  }

  ngOnInit() {
    if (!this.id) {
      return;
    }

    this.getNote();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public saveNote(note: INotifyNote, returnObservable = false) {
    this.loading = true;
    const call = this._noteService.patchNote(this.id, note).pipe(
      tap((note) => this.noteSubject$?.next(note)),
      catchError((err: AppError) => this._goBackErrorhandler(err)),
      tap(() => (this.loading = false))
    );

    if (returnObservable) {
      return call;
    }

    return call.subscribe();
  }

  public addOwner(note: INotifyNote) {
    const agents$ = this._getAvailableUsers(note);

    const ref = this._addNoteOwner.create({
      users$: agents$,
    });

    return ref.instance.submitted
      .pipe(
        switchMap((v) => {
          ref.instance.loading = true;
          const updatedNote = { ...note };

          updatedNote.owners?.push(v.user);

          return this.saveNote(updatedNote, true) as Observable<INotifyNote>;
        }),
        tap((note) => {
          ref.instance.close();
          this._updateNoteSubject(note);
        }),
        catchError((err: AppError) => this._utilsService.errorHandler(err))
      )
      .subscribe();
  }

  public manageOwners(note: INotifyNote) {
    const users$ = this._getOwners(note);

    // const company$ = this._getCompany(note);

    const ref = this._manageNoteOwners.create({
      users$: users$.pipe(),
      skeletonRows: note.owners.length - 1,
    });

    ref.instance.removeOwner
      .pipe(
        takeUntil(ref.instance.destroyed$),
        switchMap((v) => {
          //imposto il loading sul componente
          ref.instance.loading = true;

          //clono note e gli tolgo l'owner da rimuovere
          const updatedNote = { ...note };
          updatedNote.owners = updatedNote.owners?.filter((o) => o !== v);

          //aggiorno il numero di skeleton rows
          ref.instance.skeletonRows = updatedNote.owners.length - 1;

          //salvo la nota
          return this.saveNote(updatedNote, true) as Observable<INotifyNote>;
        }),
        tap((n) => {
          note = n;
          //aggiorno il subject della nota
          this._updateNoteSubject(n);

          //eseguo il refresh del subject degli utenti
          ref.instance.refreshUserSubject(this._getOwners(n));
        }),
        catchError((err: AppError) => this._utilsService.errorHandler(err)),
        tap(() => (ref.instance.loading = false))
      )
      .subscribe();

    ref.instance.addOwner
      .pipe(
        takeUntil(ref.instance.destroyed$),
        tap(() => {
          ref.instance.close();
          this.addOwner(note);
        })
      )
      .subscribe();
  }

  private _getOwners(note: INotifyNote) {
    const filteredOwners = note.owners.filter(
      (owner) => owner !== this._authService.user?._id
    );

    if (filteredOwners.length === 0) {
      return of([]);
    }

    const agents = this._agentService.getAgents(filteredOwners) as Observable<
      INotifyUser[]
    >;

    const company = note.owners.includes(
      this._authService.user?.owner as string
    )
      ? this._companyService.getCompany(this._authService.user?.owner as string)
      : of(null);

    return combineLatest([agents, company]).pipe(
      map(([users, company]) => {
        if (!company) {
          return users;
        }

        return [...users, company as INotifyUser];
      })
    );
  }

  private _getAvailableUsers(note: INotifyNote) {
    return combineLatest([
      this._agentService.getAgents(),
      this._companyService.getCompany(this._authService.user?.owner as string),
    ]).pipe(
      map(([users, company]) => {
        return [...users, company as INotifyUser];
      }),
      map((agents) =>
        agents
          .filter((agent) => {
            return !note?.owners?.includes(agent._id);
          })
          .map((user) => ({
            ...user,
            profile: {
              ...user.profile,
              surname: user.profile?.surname || '',
            },
          }))
      )
    ) as Observable<INotifyUser[]>;
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

  public getNote() {
    this._noteService
      .getNote(this.id)
      .pipe(
        tap((note) => this._updateNoteSubject(note)),
        catchError((err: AppError) => this._goBackErrorhandler(err))
      )
      .subscribe();
  }

  private _goBackErrorhandler(err: AppError) {
    return this._utilsService.errorHandler<INotifyNote>(err).pipe(
      tap(() => (this.loading = false)),
      tap(() => this.goBack())
    );
  }

  private _updateNoteSubject(note: INotifyNote) {
    this.noteSubject$?.next(note);
  }
}
