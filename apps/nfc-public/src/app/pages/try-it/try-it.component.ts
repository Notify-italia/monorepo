import { CommonModule, Location } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { INotifyEcommerceProduct, UnknownType } from '@notify/interfaces';
import {
  EcommerceService,
  LoadingComponent,
  PixelService,
} from '@notify/ngx-shared';
import { combineLatest, Observable, Subject, tap } from 'rxjs';
import { EcommerceCartFactory } from '../../components/ecommerce-cart/ecommerce-cart.factory';
import { EcommerceItemDetailFactory } from '../../components/ecommerce-item-detail/ecommerce-item-detail.factory';
import { FooterComponent } from '../../components/footer/footer.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { ProfileBuilderComponent } from '../../sections/profile-builder/profile-builder.component';

@Component({
  selector: 'notify-try-it',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    ProfileBuilderComponent,
    TopNavComponent,
    FooterComponent,
    RouterModule,
  ],
  providers: [EcommerceCartFactory, EcommerceItemDetailFactory],
  templateUrl: './try-it.component.html',
  styleUrl: './try-it.component.scss',
})
export class TryItComponent {
  private _location = inject(Location);
  private _cart = inject(EcommerceCartFactory);
  private _ecommerce = inject(EcommerceService);
  private _productFactory = inject(EcommerceItemDetailFactory);
  private _pixel = inject(PixelService);

  public builderStable$ = new Subject<boolean>();
  public pageStable$ = new Observable<UnknownType>();

  constructor() {
    afterNextRender(() => {
      this.pageStable$ = combineLatest([this.builderStable$]).pipe(
        tap(() => {
          this._pixel.track('PageView', {
            content_name: 'provalo',
          });
        })
      );
    });
  }
  public showCart() {
    this._location.replaceState('/#cart');

    const ref = this._cart.create();
    ref.instance.destroyed$.subscribe(() => {
      const pathWithoutHash = this._location.path(false);

      this._location.replaceState(pathWithoutHash);
    });
  }

  public showProductDetail() {
    const item = this._ecommerce.products.find(
      (p) => p.id === 'notify-digital'
    ) as INotifyEcommerceProduct;

    const ref = this._productFactory.create({
      item,
      submitLabel: {
        mobile: 'Acquista',
        desktop: 'Vai al checkout',
      },
    });

    ref.instance.submitted
      .pipe(
        tap((i) => {
          this._ecommerce.addToCart(item, i.quantity, i.parsedOptions);
          this._ecommerce.goToCheckout();
        })
      )
      .subscribe();
  }
}
