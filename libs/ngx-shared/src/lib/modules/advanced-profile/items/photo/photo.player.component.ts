import { Component } from '@angular/core';
import { INotifyAPPhotoItem } from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemPlayerBaseImports,
  providers: AdvancedItemPlayerBaseProviders,
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      class="flex"
      [ngStyle]="{ 'justify-content': context.getters.currentItem.align }"
    >
      @if(context.getters.currentItem.imgSrc) {
      <img
        loading="lazy"
        (click)="handleClick()"
        [src]="context.getters.currentItem.imgSrc"
        class="w-full rounded-lg pointer-events-none object-center"
        [ngClass]="{
          '!pointer-events-auto !cursor-pointer': !context.getters.currentItem.showCompanyOnClick || context.getters.currentItem.redirectUrl?.length,
        'cursor-pointer active:scale-95 smooth pointer-events-auto': context.getters.currentItem.showCompanyOnClick && context.getters.isRunningOnPlayer,
      }"
        [ngStyle]="fitNgStyle"
      />
      } @else {
      <notify-no-items
        title="Nessuna Immagine"
        class="opacity-50"
        subtitle="Carica un'immagine da visualizzare in questo blocco."
      ></notify-no-items>
      }
    </div>
  `,
})
export class PhotoPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPPhotoItem> {
  public handleClick() {
    if (!this.context.getters.isRunningOnPlayer) {
      return;
    }

    if (!this.context.getters.currentItem.showCompanyOnClick) {
      this._openLink();
      return;
    }

    this.context.emitters.itemEvent(null, 'SHOW_COMPANY_PROFILE');
  }

  public get fitNgStyle() {
    return {
      height: this.context.getters.currentItem.dimension + '%',
      width: this.context.getters.currentItem.dimension + '%',
    };
  }

  private _openLink() {
    const link = this.context.getters.currentItem.redirectUrl;
    if (!link?.length) {
      return;
    }
    console.log('handleClick');

    this.context.emitters.itemEvent(link, 'LINK_CLICKED');
    window.open(
      this.context.services.utils.populateWebProtocol('https://', link),
      '_blank'
    );
    return;
  }
}
