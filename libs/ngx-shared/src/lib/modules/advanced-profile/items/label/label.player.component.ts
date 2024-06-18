import { Component, Injector, inject } from '@angular/core';
import {
  EnumNotifyAPContainerStyles,
  INotifyAPLabelItem,
} from '@notify/interfaces';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { DynamicModuleLoaderService } from '../../../../services/dynamic-module-loader.service';
import { iframeFactory } from '../../../modals';

@Component({
  standalone: true,
  imports: AdvancedItemPlayerBaseImports,
  providers: [...AdvancedItemPlayerBaseProviders, iframeFactory],
  styleUrls: ['../../advanced-profile.styles.scss', './label.styles.scss'],
  template: `
    <div
      *ngIf="this.context.getters.container as container"
      class="!pointer-events-none"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      @if(isEmpty) {
      <notify-no-items
        title="Nessun contenuto"
        class="opacity-50"
        subtitle="Aggiungi del testo per visualizzarlo in questo blocco"
      ></notify-no-items>
      } @else {
      <div
        class="btn !block justify-stretch text-start !items-center !h-fit py-2 min-h-0"
        [ngClass]="{
            'btn-outline': isOutlined,
            'btn-ghost': isText,
            'bg-transparent border-none': isFilled,
          }"
        [ngStyle]="{
          'font-size': context.getters.fontSize,
          'background-color': isFilled ? context.getters.textColor : '',
          'border-color': isFilled ? context.getters.textColor : '',
          color: textColor,
          
        }"
      >
        <p [innerHTML]="sanitizedContent"></p>
      </div>
      }
    </div>
  `,
})
export class LabelPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPLabelItem> {
  private _moduleLoader = inject(DynamicModuleLoaderService);
  private injector = inject(Injector);

  public get isFilled() {
    return (
      this.context.getters.currentItem.style ===
      EnumNotifyAPContainerStyles.Filled
    );
  }

  public get isEmpty() {
    return (
      !this.context.getters.currentItem.content ||
      this.context.getters.currentItem.content === '<p></p>'
    );
  }

  public get sanitizedContent() {
    return this.context.services.sanitizer.bypassSecurityTrustHtml(
      this.context.getters.currentItem.content
    );
  }

  public get textColor() {
    if (!this.isFilled) {
      //se il tipo di sfondo non è filled, il colore del testo è il colore di default
      return this.context.getters.textColor;
    }

    //restituisci nero o bianco in base al contrasto con il colore del testo (usato invece come colore di sfondo)
    return this.context.services.utils.getContrastingColor(
      this.context.getters.textColor || '#000000'
    );
  }

  public get isOutlined() {
    return (
      this.context.getters.currentItem.style ===
      EnumNotifyAPContainerStyles.Outlined
    );
  }

  public get isText() {
    return (
      this.context.getters.currentItem.style ===
      EnumNotifyAPContainerStyles.Text
    );
  }
}
