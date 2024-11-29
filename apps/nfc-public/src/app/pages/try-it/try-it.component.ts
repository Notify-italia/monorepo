import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '@notify/ngx-shared';
import { combineLatest, Subject } from 'rxjs';
import { EcommerceCartFactory } from '../../components/ecommerce-cart/ecommerce-cart.factory';
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
  providers: [EcommerceCartFactory],
  templateUrl: './try-it.component.html',
  styleUrl: './try-it.component.scss',
})
export class TryItComponent {
  private _location = inject(Location);
  private _cart = inject(EcommerceCartFactory);
  private _router = inject(Router);

  public builderStable$ = new Subject<boolean>();
  public pageStable$ = combineLatest([this.builderStable$]);

  public showCart() {
    this._location.replaceState('/#cart');

    const ref = this._cart.create();
    ref.instance.destroyed$.subscribe(() => {
      const pathWithoutHash = this._location.path(false);

      this._location.replaceState(pathWithoutHash);
    });
  }
}
