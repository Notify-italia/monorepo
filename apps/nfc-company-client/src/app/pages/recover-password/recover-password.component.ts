import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecoverPasswordFormComponent } from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [CommonModule, RecoverPasswordFormComponent],
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
}
