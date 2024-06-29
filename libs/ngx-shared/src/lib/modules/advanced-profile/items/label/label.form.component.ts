import { Component, Injector, inject } from '@angular/core';

import { INotifyAPLabelItem } from '@notify/interfaces';
import { Editor, NgxEditorModule } from 'ngx-editor';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';
import { DynamicModuleLoaderService } from '../../../../services/dynamic-module-loader.service';

@Component({
  standalone: true,
  imports: [...AdvancedItemFormBaseImports, NgxEditorModule],
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss', './label.styles.scss'],
  template: `
    <div class="flex flex-col space-y-4">
      <notify-tailwind-select
        [parent]="form"
        name="style"
        label="Stile contenitore"
        [compact]="true"
        [options]="context.components.select.buttonStyles"
      >
      </notify-tailwind-select>
      <div>
        <small class="mb-0.5">Contenuto</small>
        <div class="overflow-x-auto lg:w-full">
          <ngx-editor-menu
            [editor]="editor"
            [toolbar]="[
              ['bold', 'italic'],
              ['underline', 'strike'],
              ['code', 'blockquote'],
              ['align_left', 'align_center', 'align_right', 'align_justify'],
              ['horizontal_rule', 'format_clear'],
              ['ordered_list', 'bullet_list']
            ]"
          >
          </ngx-editor-menu>
        </div>
        <div class="divider"></div>
        <ngx-editor
          [editor]="editor"
          [formControl]="this.form.controls.content"
          [placeholder]="'Inserisci del testo...'"
        ></ngx-editor>
      </div>
    </div>
  `,
})
export class LabelFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPLabelItem> {
  private _moduleLoader = inject(DynamicModuleLoaderService);
  private injector = inject(Injector);

  public editor!: Editor;

  public override componentReady(): void {
    this.editor = new Editor();
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
