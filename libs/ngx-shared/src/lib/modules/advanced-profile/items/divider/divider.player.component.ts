import { Component } from '@angular/core';
import { INotifyAPDividerItem } from '@notify/interfaces';
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
  template: `<hr
    class=" !my-0"
    [ngStyle]="{
    'border-top': border,
    
  }"
  />`,
})
export class DividerPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPDividerItem> {
  public get border() {
    return `${this.context.getters.currentItem.height}px ${this.context.getters.currentItem.style} ${this.context.getters.currentItem.color}`;
  }
}
