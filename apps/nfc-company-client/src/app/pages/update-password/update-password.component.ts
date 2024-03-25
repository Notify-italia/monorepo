import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CompanyService, UtilsService } from '@notify/nfc-app-services';
import { UpdatePasswordFormComponent } from '@notify/ngx-shared';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, UpdatePasswordFormComponent, RouterModule],
  templateUrl: './update-password.component.html',
  providers: [CompanyService, UtilsService, JwtHelperService],
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent implements OnInit {
  public config = {
    pageSubtitle: 'Dashboard',
  };

  public loading = false;

  public hasError = false;

  public get token() {
    return this._activateRoute.snapshot.queryParamMap.get('t') || '';
  }

  constructor(
    private _companyService: CompanyService,
    private _utilsService: UtilsService,
    private _activateRoute: ActivatedRoute,
    private _jwt: JwtHelperService,
    private _router: Router,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.token) {
      this.hasError = true;
    }

    if (this._jwt.isTokenExpired(this.token)) {
      this.hasError = true;
    }
  }

  public handleSubmitted(password: string) {
    this.loading = true;
    this._companyService
      .updatePassword(password, this.token)
      .pipe(
        tap(() => {
          this._toastr.success('Password aggiornata');
          this._router.navigate(['/']);
        }),
        catchError((error) => this._utilsService.errorHandler(error)),
        tap(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
}
