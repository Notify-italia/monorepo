import { Component, Inject, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppError, INotifyProfile } from '@notify/interfaces';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  map,
  of,
  pipe,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { ProfilePlayerFactory } from '../modules/profile/components/fullscreen-mockup/profile-player.factory';
import { ProfileShareSettingsFactory } from '../modules/profile/components/profile-share-settings/profile-share-settings.factory';
import { ITailwindSelectOption } from '../modules/tailwind-forms/components/tailwind-select/tailwind-select.component';
import {
  AgentService,
  AuthService,
  NoteService,
  ProfileService,
  UtilsService,
} from '../services';

export const ProfileManagementBaseComponentProviders = [
  ProfilePlayerFactory,
  AgentService,
  UtilsService,
  ProfileService,
  NoteService,
  ProfileShareSettingsFactory,
];

@Component({
  template: ``,
  standalone: true,
})
export class ProfileManagementBaseComponent implements OnDestroy {
  /**
   * Services
   */
  public _profileService = inject(ProfileService);
  public _utilsService = inject(UtilsService);
  public _playerFactroy = inject(ProfilePlayerFactory);
  public _authService = inject(AuthService);
  public _activatedRoute = inject(ActivatedRoute);
  public _noteService = inject(NoteService);
  private _shareSettingsFactory = inject(ProfileShareSettingsFactory);

  /**
   * Rxjs Subjects and Observables
   */
  public _profileSubject$ = new Subject<INotifyProfile>();
  public profile$: Observable<INotifyProfile> = this._profileSubject$;
  public destroy$ = new Subject<void>();
  public debouncedNextProfile$: Subject<INotifyProfile> =
    new Subject<INotifyProfile>();
  public notes$ = this._noteService.getNotes();
  public notesSelect$: Observable<ITailwindSelectOption[]> = this.notes$.pipe(
    map((notes) =>
      notes.map((note) => ({
        name: note.title,
        value: note._id,
      }))
    )
  );
  /**
   * Variables
   */
  public loading = false;
  public baseUrl = this._environment['profilesUrl'];
  public providedProfile =
    this._activatedRoute.snapshot.queryParamMap.get('p') || undefined;

  public get savedRedirects() {
    return this._authService.user?.savedRedirects || [];
  }

  constructor(
    @Inject('environment') private _environment: { [key: string]: string }
  ) {
    this._fetchProfileSubscription();

    this._profileDebouncerSubscription();

    this._providedProfileSubscription();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateProfileSubject(profile: INotifyProfile) {
    this.debouncedNextProfile$.next(profile as INotifyProfile);
  }

  public previewProfile(profile: INotifyProfile) {
    this._playerFactroy.create({ profile });
  }

  public saveProfile(profile: INotifyProfile) {
    this.loading = true;

    this._profileService
      .patchProfile(profile, this.providedProfile)
      .pipe(
        tap((profile) => {
          this.updateProfileSubject(profile);
        }),
        switchMap((p) => this.updateSavedRedirects(p)),
        this.refreshTokenPipe()
      )
      .subscribe();
  }

  /**
   * To be overridden
   */
  public updateSavedRedirects(profile: INotifyProfile): Observable<unknown> {
    return of(profile);
  }

  public getSavedRedirects(profile: INotifyProfile) {
    if (!this._authService.user) {
      return [];
    }

    return [
      ...new Set([
        ...(this._authService.user?.savedRedirects || []),
        profile.redirectUrl || '',
      ]),
    ].filter((r) => r);
  }

  public refreshTokenPipe() {
    return pipe(
      switchMap(() => this._authService.refreshToken()),
      catchError(async (err: AppError) => {
        return this._utilsService.errorHandler(err);
      }),
      tap(() => (this.loading = false))
    );
  }

  public errorHandlerPipe() {
    return pipe(
      catchError(async (err: AppError) => {
        return this._utilsService.errorHandler(err);
      }),
      tap(() => (this.loading = false))
    );
  }

  public openShareSettings(profile: INotifyProfile) {
    const ref = this._shareSettingsFactory.create({
      profile,
      baseUrl: `${this.baseUrl}/p/`,
    });

    ref.instance.submitted
      .pipe(
        takeUntil(this.destroy$),
        switchMap((v) => {
          ref.instance.loading = true;
          return this._profileService
            .patchProfile(v, this.providedProfile)
            .pipe(
              tap((profile) => {
                this.updateProfileSubject(profile);
              }),
              this.refreshTokenPipe()
            );
        }),
        tap(() => ref.instance.close())
      )
      .subscribe();
  }

  /**
   * To be overridden
   */
  public _fetchProfileSubscription() {
    return;
  }

  /**
   * To be overridden
   */
  public removeSavedRedirect(url: string): void {
    // * scrivo url qui a caso giusto per rimuovere l'erore di ts di variabile inutilizzata
    url;
    return;
  }

  private _profileDebouncerSubscription() {
    this.debouncedNextProfile$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(250),
        tap((profile) => this._profileSubject$.next(profile))
      )
      .subscribe();
  }

  private _providedProfileSubscription() {
    this._activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['p'] !== this.providedProfile) {
          //? questo è un workaround per forzare il refresh della pagina quando cambia il parametro p nella query string
          //così da permettere il passaggio seamless dalla modifica di un profilo utente al proprio profilo se si è una company
          location.reload();
        }
      });
  }
}
