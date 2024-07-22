import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { CatalogResponse } from '@notify/interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcwidService {
  private _http = inject(HttpClient);

  constructor(@Inject('storeId') private storeId: number) {}

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
