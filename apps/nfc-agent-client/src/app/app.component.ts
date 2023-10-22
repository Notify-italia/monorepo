import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from '@notify/nfc-app-components';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, NavComponent],
  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'nfc-agent-client';
}
