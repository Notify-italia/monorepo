import { Component, Injector, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { INotifyAPLabelItem } from '@notify/interfaces';
import { Editor, NgxEditorModule } from 'ngx-editor';
import {
  AdvancedItemPlayerBaseImports,
  AdvancedItemPlayerBaseProviders,
  AdvancedProfileItemPlayerBaseComponent,
} from '../../../../constructors/ap-item.player.base.component';
import { CachedSrcDirective } from '../../../../directives';
import { DynamicModuleLoaderService } from '../../../../services/dynamic-module-loader.service';
import { iframeFactory } from '../../../modals';

@Component({
  standalone: true,
  imports: [
    ...AdvancedItemPlayerBaseImports,
    CachedSrcDirective,
    NgxEditorModule,
    ReactiveFormsModule,
  ],
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
      <ngx-editor
        [editor]="editor"
        [formControl]="fcContent"
        [placeholder]="'Inserisci un testo da mostrare in questo blocco'"
      ></ngx-editor>
    </div>
  `,
})
export class LabelPlayerComponent extends AdvancedProfileItemPlayerBaseComponent<INotifyAPLabelItem> {
  private _moduleLoader = inject(DynamicModuleLoaderService);
  private injector = inject(Injector);

  public editor = new Editor();

  public get fcContent() {
    return new FormControl(this.context.getters.currentItem.content);
  }

  /**
   * sto troiaio del cazzo serve per permettere il lazy loading del modulo ngx-editor in SSR
   * funziona ma non so come cazzo funzioni perchè il metodo non viene mai chiamato da nessuna parte
   *! rimuovere con cautela dato che ngx-editor ufficialmente non supporta l'SSR
   */
  async lazyLoadModule() {
    if (!this._moduleLoader) {
      this._moduleLoader = this.injector.get(DynamicModuleLoaderService);
    }

    await this._moduleLoader.loadModule(
      import('ngx-editor').then((m) => m.NgxEditorModule)
    );
  }
}
