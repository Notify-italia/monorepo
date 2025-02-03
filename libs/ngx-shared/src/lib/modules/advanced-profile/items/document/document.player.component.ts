import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { INotifyAPDocumentItem, INotifyAPLinkItem } from '@notify/interfaces';

import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { SvgBoxIcon } from '../../../../services';
import { IAdvancedProfileItemEvent } from '../../services/advanced-profile-item-outputs.service';

@Component({
  standalone: true,
  imports: AdvancedItemPlayerBaseImports,
  providers: AdvancedItemPlayerBaseProviders,
  styleUrl: '../../advanced-profile.styles.scss',
  template: `
    <div
      class="flex flex-col rounded-lg relative overflow-hidden"
      *ngIf="this.context.getters.container as container"
      [class]="container.class"
      [ngStyle]="container.ngStyle"
      [ngClass]="container.ngClass"
    >
      @if(context.getters.currentItem.docSrc) {
      @if(context.getters.currentItem.showInline) {
      <object
        [data]="safeSrc"
        [ngStyle]="{
            height: context.getters.currentItem.boxHeight + 'px',
          }"
        frameborder="0"
        style="scale: 1.02"
        type="application/pdf"
      ></object>

      <div
        style="background-image: linear-gradient(transparent, {{
          this.context.getters.textColor
        }});"
        class="absolute  h-full z-10 bottom-0 w-full rounded-b-lg flex flex-col justify-end p-2 space-y-2 "
      >
        <p
          *ngIf="context.getters.currentItem.showFilename"
          [ngStyle]="{
            color: this.context.services.utils.getContrastingColor(
              this.context.getters.textColor || '#000000'
            )
          }"
          class="truncate"
        >
          {{ documentFilename }}
        </p>

        <button
          (click)="handleButtonClick()"
          class="w-full active:scale-95 smooth border border-current brightness-150 rounded-md bg-current px-2 py-1"
        >
          <span
            class="flex justify-center space-x-2 items-center"
            [ngStyle]="{
              color: this.context.services.utils.getContrastingColor(
                this.context.getters.textColor || '#000000'
              )
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>

            <span>Apri</span>
          </span>
        </button>
      </div>
      } @else {
      <notify-player-base-button
        [direction]="context.statics.directions.Vertical"
        [style]="context.getters.currentItem.buttonStyle"
        [button]="context.getters.currentItem.button"
        [icon]="buttonIcon"
        [context]="context"
        (buttonClicked)="handleButtonClick()"
      ></notify-player-base-button>
      } } @else {
      <notify-no-items
        title="Nessun Documento"
        class="opacity-50"
        subtitle="Carica un documento da visualizzare in questo blocco."
      ></notify-no-items>
      }
    </div>
  `,
})
export class DocumentPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPDocumentItem> {
  public buttonIcon: SvgBoxIcon = {
    name: 'file-text',
    set: 'custom',
    data: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>
`,
  };
  public safeSrc?: SafeResourceUrl;

  public get documentFilename() {
    return this.context.getters.currentItem.docSrc
      ?.split('/')
      .pop()
      ?.split('?')[0];
  }

  public override componentReady(): void {
    this._setSafePdf();

    this.context.getters.componentChanged$.subscribe(() => this._setSafePdf());
  }

  private _setSafePdf() {
    this.safeSrc =
      this.context.services.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.context.getters.currentItem.docSrc}#toolbar=0&navpanes=0&scrollbar=0"`
      );
  }

  public handleButtonClick() {
    this.context.emitters.itemEvent(
      {
        ...this.context.getters.currentItem.button,
        url: this.context.getters.currentItem.docSrc,
      } as IAdvancedProfileItemEvent<INotifyAPLinkItem>['eventData'],
      'LINK_CLICKED'
    );
    window.open(this.context.getters.currentItem.docSrc, '_blank');
  }
}
