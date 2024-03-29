import { Component, Inject, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppError, INotifyProfile } from '@notify/interfaces';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  of,
  pipe,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ProfilePlayerFactory } from '../modules';
import { AuthService, ProfileService, UtilsService } from '../services';

type IProfile = INotifyProfile;

@Component({
  template: ``,

  standalone: true,
})
export class ProfileManagementBaseComponent implements OnDestroy {
  public _profileService = inject(ProfileService);
  public _utilsService = inject(UtilsService);
  public _playerFactroy = inject(ProfilePlayerFactory);
  public _authService = inject(AuthService);
  public _activatedRoute = inject(ActivatedRoute);

  public _profileSubject$ = new Subject<IProfile>();
  public profile$: Observable<IProfile> = this._profileSubject$;
  public loading = false;
  public baseUrl = this._environment['profilesUrl'];
  public providedProfile =
    this._activatedRoute.snapshot.queryParamMap.get('p') || undefined;

  public destroy$ = new Subject<void>();

  public debouncedNextProfile$: Subject<INotifyProfile> =
    new Subject<IProfile>();

  public get savedRedirects() {
    return this._authService.user?.savedRedirects || [];
  }

  constructor(
    @Inject('environment') private _environment: { [key: string]: string }
  ) {
    this._getProfile();

    this.debouncedNextProfile$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(250),
        tap((profile) => this._profileSubject$.next(profile))
      )
      .subscribe();

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

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateProfileSubject(profile: INotifyProfile) {
    this.debouncedNextProfile$.next(profile as IProfile);
  }

  public previewProfile(profile: INotifyProfile) {
    this._playerFactroy.create({ profile });
  }

  public saveProfile(profile: IProfile) {
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

  public updateSavedRedirects(profile: IProfile): Observable<unknown> {
    return of(profile);
  }

  public getSavedRedirects(profile: IProfile) {
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

  public _getProfile() {}

  public removeSavedRedirect(url: string): void {
    return;
  }
}
