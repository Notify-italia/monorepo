import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcommerceService } from '@notify/ngx-shared';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'notify-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private platformId = inject(PLATFORM_ID);
  private googleTagId = 'AW-16462555562';
  private renderer = inject(Renderer2);
  private ecommerceService = inject(EcommerceService);
  private el = inject(ElementRef);
  constructor() {
    afterNextRender(() => {
      this.ecommerceService.init();

      // BROWSER
      if (isPlatformBrowser(this.platformId)) {
        const script = this.renderer.createElement(
          'script'
        ) as HTMLScriptElement;
        script.src = `//www.googletagmanager.com/gtag/js?id=${this.googleTagId}`;
        script.async = true;
        this.renderer.appendChild(this.el.nativeElement, script);

        const script2 = this.renderer.createElement(
          'script'
        ) as HTMLScriptElement;
        const scriptBody = this.renderer.createText(`
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', '${this.googleTagId}');
      `);
        this.renderer.appendChild(script2, scriptBody);
        this.renderer.appendChild(this.el.nativeElement, script2);
      }
    });
  }
}
