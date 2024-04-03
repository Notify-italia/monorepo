import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { INotifyAuth } from '@notify/interfaces';
import { AuthComponent, RootService } from '@notify/ngx-shared';

@Component({
  selector: 'notify-signin',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public rootService = inject(RootService);
  public loading = false;

  public config = {
    submitLabel: "Entra nell'app",
    pageSubtitle: 'CMS',
    pageTitle: "Effettua l'accesso",
    signupRoute: '',
    forgotPasswordRoute: '',
    hideEmail: true,
  };

  public signin(data: INotifyAuth) {
    this.loading = true;

    this.rootService.setAuthentication(data.password);
    location.reload();
  }
}
