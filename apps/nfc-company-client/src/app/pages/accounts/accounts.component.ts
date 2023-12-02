import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppError, INotifyAgent, INotifyCompany } from '@notify/interfaces';
import {
  AgentService,
  AuthService,
  ProfileService,
} from '@notify/nfc-app-services';
import {
  PageHeaderComponent,
  ProfilePlayerFactory,
} from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  public agentsSubject$ = new Subject<INotifyAgent[]>();
  public agents$: Observable<INotifyAgent[]> = this.agentsSubject$;

  public get maxAgents(): number {
    const user = this._authService.user as unknown as INotifyCompany<true>;

    return user.license.allowedAgents;
  }

  constructor(
    private _agentService: AgentService,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _profileService: ProfileService,
    private _profileFactory: ProfilePlayerFactory
  ) {}

  ngOnInit(): void {
    this.getAgents().subscribe();
  }

  private _getPlayerUrl(profile: INotifyAgent['profile']) {
    if (!profile) {
      return '';
    }

    return this._profileService.genPlayerUrl(
      environment.publicUrl,
      profile._id
    );
  }

  public getAgents() {
    return this._agentService.getAgents().pipe(
      tap((agents) => {
        this.agentsSubject$.next(agents);
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
      playerUrl: this._getPlayerUrl(profile),
    });
  }
}
