import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { UnknownType } from '@notify/interfaces';

declare const gtag: (...args: UnknownType[]) => void;

@Component({
  selector: 'notify-ocra-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ocra-success.component.html',
  styleUrl: './ocra-success.component.scss',
})
export class OcraSuccessComponent {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private googleTagId = 'AW-16462555562';
  constructor() {
    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
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

      gtag('event', 'conversion', {
            send_to: 'AW-16462555562/iP_7CMGbtqUaEKrT-qk9',
            value: 1.0,
            currency: 'EUR',
          });
    `);
      this.renderer.appendChild(script2, scriptBody);
      this.renderer.appendChild(this.el.nativeElement, script2);
    });
  }
}
