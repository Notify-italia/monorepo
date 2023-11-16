import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from '@notify/ngx-components';

@Component({
  standalone: true,
  imports: [RouterModule, NavComponent],
  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
