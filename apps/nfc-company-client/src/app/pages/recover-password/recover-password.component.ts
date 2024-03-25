import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyService, UtilsService } from '@notify/nfc-app-services';
import { RecoverPasswordFormComponent } from '@notify/ngx-shared';
import { catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RecoverPasswordFormComponent, RouterModule],
  providers: [CompanyService, UtilsService],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent {
  public config = {
    pageTitle: 'Recupera password',
    submitLabel: 'Invia email di recupero',
    pageSubtitle: 'Dashboard',
    signinRoute: '/signin',
  };

  public submitted = false;
  public loading = false;

  constructor(
    private _companyService: CompanyService,
    private _utilsService: UtilsService
  ) {}

  public handleEmailSubmitted(email: string) {
    this.loading = true;
    this._companyService
      .recoverPassword(email)
      .pipe(
        tap(() => {
          this.submitted = true;
        }),
        catchError((error) => this._utilsService.errorHandler(error)),
        tap(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
}
