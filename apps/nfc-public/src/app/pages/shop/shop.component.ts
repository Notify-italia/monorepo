import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div id="my-store-104545811"></div>
      <div id="ecwidScriptsSection"></div>
    </div>
  `,
})
export class ShopComponent implements OnInit {
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public ngOnInit() {
    const storeId = 104545811;
    const script = this.renderer2.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute(
      'src',
      `https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_date=2020-02-17`
    );
    script.onload = this.injectEcwidProductBrowser(storeId);

    this.renderer2.appendChild(
      this.document.getElementById('ecwidScriptsSection'),
      script
    );
  }

  private injectEcwidProductBrowser(storeId: number) {
    return () => {
      const ecwidBrowserScript = document.createElement('script');
      ecwidBrowserScript.setAttribute('type', 'text/javascript');
      ecwidBrowserScript.setAttribute('charset', 'utf-8');
      ecwidBrowserScript.text = `xProductBrowser("categoriesPerRow=3","views=grid(20,3) list(60) table(60)","categoryView=grid","searchView=list","id=my-store-${storeId}");`;
      document.head.appendChild(ecwidBrowserScript);
    };
  }
}
