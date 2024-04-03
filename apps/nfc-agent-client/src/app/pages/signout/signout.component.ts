import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService, LoadingComponent } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent {
  constructor(private _authService: AuthService) {
    this._authService.signOut();
  }
}
