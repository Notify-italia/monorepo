import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { UnknownObject } from '@notify/interfaces';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'notify-shop',
  template: `
    <div class="max-content-width min-h-[100lvh]">
      <div class="website-section relative">
        <div class="section-title">Pronto per il salto di qualità?</div>
        <div class="section-subtitle">
          Scegli il tipo di card che fa per te per procedere con l'acquisto 🔥
        </div>

        <div class="mt-20 ">
          <div
            class="ecsp ecsp-SingleProduct-v2 ecsp-Product ec-Product-661415395"
            itemtype="http://schema.org/Product"
            data-single-product-id="661415395"
          >
            <div
              class="ecsp-title"
              itemprop="name"
              style="display:none;"
              content="Combo Carta e Stand Review"
            ></div>
            <div customprop="addtobag"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ShopComponent implements OnInit {
  private _platformId = inject(PLATFORM_ID);
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public ngOnInit() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    const storeId = 104545811;
    const script = this.renderer2.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute(
      'src',
      `https://app.ecwid.com/script.js?104545811&data_platform=singleproduct_v2`
    );
    script.onload = this.injectEcwidProductBrowser(storeId);

    this.renderer2.appendChild(
      this.document.getElementById('ecwidScriptsSection'),
      script
    );

    const ecWindow = window as UnknownObject;

    ecWindow.ec = ecWindow.ec || {};
    ecWindow.ec.config = ecWindow.ec.config || {};
    ecWindow.ec.config.scroll_indent = 150;

    ecWindow.ec.storefront.show_footer_menu = false;
    ecWindow.ec.storefront.enable_page_transitions = true;

    // ecWindow.ec.storefront.product_list_show_frame = false;
  }

  private injectEcwidProductBrowser(storeId: number) {
    return () => {
      const ecwidBrowserScript = document.createElement('script');
      ecwidBrowserScript.setAttribute('type', 'text/javascript');
      ecwidBrowserScript.setAttribute('charset', 'utf-8');
      ecwidBrowserScript.text = `xProduct();`;
      document.head.appendChild(ecwidBrowserScript);
    };
  }
}
