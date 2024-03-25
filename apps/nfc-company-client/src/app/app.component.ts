import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageTitleService } from '@notify/ngx-shared';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],

  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _pageTitleService: PageTitleService) {
    this._pageTitleService.init();
  }
}
