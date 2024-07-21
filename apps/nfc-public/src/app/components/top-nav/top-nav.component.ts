import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTitleComponent } from '@notify/ngx-shared';

@Component({
  selector: 'notify-top-nav',
  standalone: true,
  imports: [CommonModule, AppTitleComponent, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent implements OnInit {
  private _platformId = inject(PLATFORM_ID);
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public ngOnInit() {
    if (!this._platformId) {
      return;
    }
    const storeId = 104545811;
    const script = this.renderer2.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute(
      'src',
      `https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_date=2024-07-21`
    );
    script.onload = this.injectEcwidProductBrowser();

    this.renderer2.appendChild(
      this.document.getElementById('ecwidCardWidgetScript'),
      script
    );
  }

  private injectEcwidProductBrowser() {
    return () => {
      const ecwidBrowserScript = document.createElement('script');
      ecwidBrowserScript.setAttribute('type', 'text/javascript');
      ecwidBrowserScript.setAttribute('charset', 'utf-8');
      ecwidBrowserScript.text = `Ecwid.init();`;
      document.head.appendChild(ecwidBrowserScript);
    };
  }
}
