import { Component } from '@angular/core';
import { INotifyAPPlaceItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { GoogleMapsComponent } from '../../../../standalones';

@Component({
  standalone: true,
  imports: [...AdvancedItemPlayerBaseImports, GoogleMapsComponent],
  providers: AdvancedItemPlayerBaseProviders,
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      class="{{ container.class }} flex flex-col space-y-2 text-center"
      *ngIf="this.context.getters.container as container"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      <div
        class="box !rounded-lg !bg-white/10"
        *ngIf="this.context.getters.currentItem.showStreetName && publicAddress"
      >
        <small>
          {{ publicAddress }}
        </small>
      </div>

      <notify-google-maps
        [address]="mapsQuery"
        class="!w-full"
        [zoom]="this.context.getters.currentItem.zoom"
      ></notify-google-maps>
    </div>
  `,
})
export class PlacePlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPPlaceItem> {
  public get publicAddress() {
    const { address, civicNumber, city } = this.context.getters.currentItem;

    if ([address, civicNumber, city].every((item) => !item)) {
      return '';
    }

    return `${address} ${civicNumber}${city ? `, ${city}` : ''}`;
  }

  public get mapsQuery() {
    const currentItem = this.context.getters.currentItem;

    return `${currentItem.address} ${currentItem.civicNumber} ${currentItem.city} ${currentItem.companyName}`;
  }
}
