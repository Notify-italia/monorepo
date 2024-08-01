import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcwidService } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _ecwid = inject(EcwidService);
  private _renderer = inject(Renderer2);
  private _platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    this._ecwid.initEcwidAPI(this._renderer);
  }
}
