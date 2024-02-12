import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AppError,
  EnumNotifyUserType,
  INotifyAgent,
  INotifyCompany,
  INotifyPartialAgent,
} from '@notify/interfaces';
import {
  AgentService,
  AuthService,
  CompanyService,
  ProfileService,
  UtilsService,
} from '@notify/nfc-app-services';
import {
  AccountsTableComponent,
  ConfirmModalFactory,
  LoadingComponent,
  PageHeaderComponent,
  ProfilePlayerFactory,
  UserFormFactory,
} from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    AccountsTableComponent,
  ],
  providers: [
    AgentService,
    ProfilePlayerFactory,
    UserFormFactory,
    ConfirmModalFactory,
    UtilsService,
    CompanyService,
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  public agentsSubject$ = new Subject<INotifyAgent[]>();
  public agents$: Observable<INotifyAgent[]> = this.agentsSubject$;

  public agents: number = 0;

  public get maxAgents(): number {
    const user = this._authService.user as unknown as INotifyCompany<true>;

    return user.license.allowedAgents;
  }

  public get company() {
    return this._authService.user as unknown as INotifyCompany<true>;
  }

  constructor(
    private _agentService: AgentService,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _profileFactory: ProfilePlayerFactory,
    private _userFormFactory: UserFormFactory,
    private _confirmModalFactory: ConfirmModalFactory,
    private _utilsService: UtilsService,
    private _companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.getAgents().subscribe();
  }

  public getAgents() {
    return combineLatest([
      this._agentService.getAgents(),
      this._profileService.getProfile(),
    ]).pipe(
      tap(([agents, profile]) => {
        const populatedAgents = agents.map((agent) => {
          if (!agent.profile) {
            return agent;
          }

          agent.profile.company = profile;
          return agent;
        });

        this.agents = populatedAgents.length || 0;

        this.agentsSubject$.next(populatedAgents);
      }),
      catchError((error: AppError) => this._utilsService.errorHandler(error))
    );
  }

  public inspectProfile(profile: INotifyAgent['profile']) {
    if (!profile) {
      return;
    }

    this._profileFactory.createPlayer({
      profile,
      baseUrl: environment.profilesUrl,
    });
  }

  public deleteUser(agent: INotifyAgent) {
    const ref = this._confirmModalFactory.create({
      title: 'Elimina utente',
      description:
        'Sei sicuro di voler eliminare questo utente? Questa azione è irreversibile.',
      confirmText: 'Elimina',
      cancelText: 'Annulla',
      value: agent._id,
      confirmClass: this._confirmModalFactory.deleteBtn,
    });

    ref.instance.submitted
      .pipe(
        takeUntil(ref.instance.destroyed$),
        switchMap((id) => {
          if (!id) {
            return [];
          }
          ref.instance.loading = true;
          return this._agentService.delete(id as string);
        }),
        switchMap(() => this.getAgents()),
        tap(() => {
          ref.destroy();
          this._toastr.success('Utente eliminato!', 'OK');
        }),
        catchError((error: AppError) => {
          ref.instance.loading = false;
          return this._utilsService.errorHandler(error);
        })
      )
      .subscribe();
  }

  public showUserForm(agent?: INotifyAgent) {
    const ref = this._userFormFactory.createForm<EnumNotifyUserType.Agent>(
      agent,
      this.company.createdRoles
    );

    ref.instance.removeRole
      .pipe(
        takeUntil(ref.instance.destroyed$),
        switchMap((role) => this._removeRole(role)),
        tap((v) => {
          ref.instance.createdRoles = v?.createdRoles || [];
          this.company.createdRoles = v?.createdRoles || [];
        })
      )
      .subscribe();

    ref.instance.submitted
      .pipe(
        takeUntil(ref.instance.destroyed$),
        tap((agent) =>
          this._addRole((agent as INotifyPartialAgent).role || '').subscribe()
        ),
        switchMap((_a) => {
          ref.instance.loading = true;

          if (agent) {
            return this._agentService.patch(agent._id, _a);
          }

          return this._agentService.signUp(_a);
        }),

        switchMap(() => this.getAgents()),
        tap(() => {
          this._toastr.success('Utente salvato!', 'OK');
          ref.instance.loading = false;
          ref.instance.close();
        }),

        catchError((error: AppError, c) => {
          this._utilsService.errorHandler(error);
          ref.instance.loading = false;

          return c;
        })
      )
      .subscribe();
  }

  private _addRole(role: string) {
    const createdRoles = [...new Set([...this.company.createdRoles, role])];

    return this._companyService
      .patchCompany({ createdRoles })
      .pipe(switchMap(() => this._authService.refreshToken()));
  }

  private _removeRole(role: string) {
    const ref = this._confirmModalFactory.create({
      title: 'Elimina ruolo',
      description:
        'Sei sicuro di voler eliminare questo ruolo? Eliminarlo non comporterà la cancellazione degli utenti a cui è assegnato.',
      confirmText: 'Elimina',
      cancelText: 'Annulla',
      value: role,
      confirmClass: this._confirmModalFactory.deleteBtn,
    });

    return ref.instance.submitted.pipe(
      takeUntil(ref.instance.destroyed$),
      switchMap((role) => {
        if (!role) {
          return of(this.company);
        }

        const createdRoles = this.company.createdRoles.filter(
          (r) => r !== role
        );

        ref.instance.loading = true;
        return this._companyService.patchCompany({ createdRoles }).pipe(
          switchMap(() => this.getAgents()),
          switchMap(() => this._authService.refreshToken())
        );
      }),
      tap(() => {
        ref.destroy();
      }),
      catchError((error: AppError) => {
        ref.instance.loading = false;
        return this._utilsService.errorHandler<null>(error, null);
      })
    );
  }
}
