import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthComponent } from '@notify/nfc-app-components';

@Component({
  selector: 'notify-signin',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  public loading = false;

  public config = {
    submitLabel: "Entra nell'app",
    pageTitle: "Effettua l'accesso",
  };
}
