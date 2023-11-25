import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppError, INotifyAgent, INotifyCompany } from '@notify/interfaces';
import { AgentService, AuthService } from '@notify/nfc-app-services';
import {
  PageHeaderComponent,
  ProfilePlayerFactory,
} from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  providers: [AgentService, ProfilePlayerFactory],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  public placeholderAvatar =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
  public profilesSubject$ = new Subject<INotifyAgent[]>();
  public profiles$: Observable<INotifyAgent[]> = this.profilesSubject$;

  public get maxAgents(): number {
    const user = this._authService.user as unknown as INotifyCompany<true>;

    return user.license.allowedAgents;
  }

  constructor(
    private _agentService: AgentService,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _profilePlayer: ProfilePlayerFactory
  ) {}

  ngOnInit(): void {
    this.getAgents().subscribe();
  }

  public getAgents() {
    return this._agentService.getAgents().pipe(
      tap((agents) => {
        this.profilesSubject$.next(agents);
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
    this._profilePlayer.show({ profile });
  }
}
