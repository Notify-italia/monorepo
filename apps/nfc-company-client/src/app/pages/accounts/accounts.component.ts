import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppError, INotifyAgent } from '@notify/interfaces';
import { AgentService } from '@notify/nfc-app-services';
import { PageHeaderComponent } from '@notify/ngx-components';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  providers: [AgentService],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  public placeholderAvatar =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';
  public profilesSubject$ = new Subject<INotifyAgent[]>();
  public profiles$: Observable<INotifyAgent[]> = this.profilesSubject$;

  constructor(
    private _agentService: AgentService,
    private _toastr: ToastrService
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
}
