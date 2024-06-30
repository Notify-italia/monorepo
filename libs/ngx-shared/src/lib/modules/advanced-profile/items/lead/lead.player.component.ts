import { Component } from '@angular/core';
import { INoitfyAPLeadItem } from '@notify/interfaces';
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
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      <notify-player-base-button
        class="w-full"
        [direction]="context.statics.directions.Vertical"
        [style]="currentItem.style"
        [button]="{
          visible: true,
          icon: 'pencil',
          caption: context.getters.currentItem.buttonLabel || 'Lascia il tuo contatto',
          url: '',
        
        }"
        [context]="context"
        [icon]="{
          name: 'pencil',
          set: isOutlined ? 'hero-outline' : 'hero-solid',
        }"
        (buttonClicked)="openContactForm()"
      ></notify-player-base-button>
    </div>
  `,
})
export class LeadPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INoitfyAPLeadItem> {
  public get isOutlined() {
    return (
      this.context.getters.currentItem.style ===
      this.context.statics.buttonStyles.Outlined
    );
  }

  public openContactForm() {
    this.context.emitters.itemEvent(
      {
        owner: this.context.getters.profile.owner,
        visibleFields: this.context.getters.currentItem.fields.filter(
          (field) => field.visible
        ),
      },
      'CREATE_CONTACT_FORM_MODAL'
    );
  }
}
