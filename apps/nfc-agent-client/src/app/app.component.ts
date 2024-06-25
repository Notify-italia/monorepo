import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavComponent, PageTitleService } from '@notify/ngx-shared';
import { SuppressLongpressGesture } from 'capacitor-suppress-longpress-gesture';

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
    SuppressLongpressGesture.activateService();
  }
}
