import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@notify/nfc-app-services';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent {
  constructor(private _authService: AuthService) {
    this._authService.signOut();
  }
}
