import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageTitleService } from '@notify/nfc-app-services';
import { NavComponent } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [RouterModule, NavComponent],
  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _pageTitle: PageTitleService) {
    this._pageTitle.init();
  }
}
