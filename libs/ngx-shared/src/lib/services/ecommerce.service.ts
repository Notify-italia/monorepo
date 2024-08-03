import { Injectable, inject } from '@angular/core';
import { INotifyEcommerceCart } from '@notify/interfaces';
import { Subject, tap } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class EcommerceService {
  private _http = inject(HttpService);

  public cart$ = new Subject<INotifyEcommerceCart>();

  private _lsCustomerId = 'notify-ecommerce-customer-id';

  public get customerId() {
    return localStorage.getItem(this._lsCustomerId);
  }

  public init() {
    if (!this.customerId) {
      this._generateCustomerId();
    }
  }

  public updateCart() {
    return this._http
      .get<INotifyEcommerceCart>(`/v1/cart`, {
        customerId: this.customerId,
      })
      .pipe(
        tap((cart) => {
          this.cart$.next(cart);
        })
      );
  }

  private _generateCustomerId() {
    const customerId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(this._lsCustomerId, customerId);
  }
}
