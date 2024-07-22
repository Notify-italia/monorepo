import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EcwidService, SSRBaseComponent } from '@notify/ngx-shared';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'notify-shop',
  styleUrls: ['./shop.component.scss'],
  templateUrl: './shop.component.html',
})
export class ShopComponent extends SSRBaseComponent {
  private ecwid = inject(EcwidService);

  public products$ = this.ecwid
    .getProducts()
    .pipe(tap(() => this.componentIsStable()));

  constructor() {
    super();
  }

  public buildCssImgUrl(url: string) {
    return {
      ['background-image']: `url('${url}')`,
    };
  }
}
