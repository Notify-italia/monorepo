import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AppError,
  EnumNotifyUserType,
  INotifyAgent,
  INotifyCompany,
} from '@notify/interfaces';
import {
  AgentService,
  AuthService,
  ProfileService,
} from '@notify/nfc-app-services';
import {
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
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccountsRowComponent } from '../../components/accounts-row/accounts-row.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    LoadingComponent,
    AccountsRowComponent,
  ],
  providers: [
    AgentService,
    ProfilePlayerFactory,
    UserFormFactory,
    ConfirmModalFactory,
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  public agentsSubject$ = new Subject<INotifyAgent[]>();
  public agents$: Observable<INotifyAgent[]> = this.agentsSubject$;

  public agents: number | null = null;

  public get maxAgents(): number {
    const user = this._authService.user as unknown as INotifyCompany<true>;

    return user.license.allowedAgents;
  }

  constructor(
    private _agentService: AgentService,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _profileFactory: ProfilePlayerFactory,
    private _userFormFactory: UserFormFactory,
    private _confirmModalFactory: ConfirmModalFactory
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

        this.agents = populatedAgents.length;

        this.agentsSubject$.next(populatedAgents);
      }),
      catchError((error: AppError) => {
        this._toastr.error(error.error.errors[0].message, 'Errore');
        return [];
      })
    );
  }

  public inspectProfile(profile: INotifyAgent['profile']) {
    if (!profile) {
      return;
    }

    this._profileFactory.createPlayer({
      profile,
      playerUrl: this._profileService.genPlayerUrl(
        environment.publicUrl,
        profile._id
      ),
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
      confirmClass: 'btn btn-error !text-white w-28',
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
          console.error(error);
          ref.instance.loading = false;
          this._toastr.error(error.error.errors[0].message, 'Errore');
          return [];
        })
      )
      .subscribe();
  }

  public showUserForm(agent?: INotifyAgent) {
    const ref =
      this._userFormFactory.createForm<EnumNotifyUserType.Agent>(agent);

    ref.submitted
      .pipe(
        takeUntil(ref.destroyed$),
        switchMap((_a) => {
          ref.loading = true;

          if (agent) {
            return this._agentService.patch(agent._id, _a);
          }

          return this._agentService.signUp(_a);
        }),
        switchMap(() => this.getAgents()),
        tap(() => {
          this._toastr.success('Utente salvato!', 'OK');
          ref.loading = false;
          ref.close();
        }),

        catchError((error: AppError, c) => {
          this._toastr.error(error.error.errors[0].message, 'Errore');
          ref.loading = false;

          return c;
        })
      )
      .subscribe();
  }
}
