import { HttpClient } from '@angular/common/http';
import {
  afterNextRender,
  Inject,
  inject,
  Injectable,
  Renderer2,
} from '@angular/core';
import { CatalogResponse, UnknownObject } from '@notify/interfaces';
import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcwidService {
  private _http = inject(HttpClient);

  constructor(@Inject('storeId') private storeId: number) {
    afterNextRender(() => {
      (window as UnknownObject)._ecwidLoaded$ = new Subject<{
        ec: UnknownObject;
        Ecwid: UnknownObject;
      }>();

      (window as UnknownObject)._ecwidLoaded$.subscribe(() => {
        console.log('Ecwid API loaded');
        console.log(`Ecwid`, (window as UnknownObject).Ecwid);
        console.log(`ec`, (window as UnknownObject).ec);
      });
    });
  }

  public get Ecwid() {
    return (window as UnknownObject).Ecwid;
  }

  public get ec() {
    return (window as UnknownObject).ec;
  }

  public initEcwidAPI(renderer: Renderer2) {
    const script: HTMLScriptElement = renderer.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute(
      'src',
      `https://app.ecwid.com/script.js?${this.storeId}`
    );
    script.onload = () => {
      const ecwidBrowserScript = document.createElement('script');
      ecwidBrowserScript.setAttribute('type', 'text/javascript');
      ecwidBrowserScript.setAttribute('charset', 'utf-8');
      ecwidBrowserScript.text = `Ecwid.init(); Ecwid.OnAPILoaded.add(() => {
      window.ec = window.ec || Object();
      window.Ecwid = window.Ecwid || Object();
      this.ec.config.store_main_page_url = 'http://localhost:4200/shop';
      window._ecwidLoaded$.next({
        ec: window.ec,
        Ecwid: window.Ecwid,});

      });`;
      // ecwidBrowserScript.text = `xProduct("id=my-store-${storeId}")`;

      document.head.appendChild(ecwidBrowserScript);
    };

    renderer.appendChild(
      document.getElementById('ecwidCardWidgetScript'),
      script
    );
  }

  private handleEcwidScriptLoad() {
    console.log('Ecwid API loaded', this.ec);
    this.ec.config.store_main_page_url = 'http://www.example.com/store.html';
  }

  public getProducts() {
    return this._http
      .post<CatalogResponse>(
        `https://app.ecwid.com/storefront/api/v1/${this.storeId}/catalog`,
        {
          catalogOnOnePage: false,
          lang: 'it',
          parentCategoryId: 0,
          pagination: { offset: 0, limit: 60 },
          urlParams: {
            baseUrl: '',
            canonicalBaseUrl: '',
            isCleanUrls: false,
            isCanonicalUrlsEnabled: false,
            isSlugsWithoutIds: false,
          },
        }
      )
      .pipe(map((response) => response.expandedCategories[0].products));
  }
}
export const provideEcwid = (config: { storeId: number }) => ({
  provide: EcwidService,
  useFactory: () => new EcwidService(config.storeId),
  deps: [HttpClient],
});
