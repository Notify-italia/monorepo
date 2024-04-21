import { CommonModule } from '@angular/common';
import { Component, Injector } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNoteItemText } from '@notify/interfaces';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import { DynamicModuleLoaderService } from '../../../../../services/dynamic-module-loader.service';

@Component({
  selector: 'notify-note-text-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './note-text-item.component.html',
  styleUrls: ['./note-text-item.component.scss', '../../../notes.styles.scss'],
})
export class NoteTextItemComponent extends NoteItemBaseComponent {
  public editor!: Editor;

  constructor(
    private _moduleLoader: DynamicModuleLoaderService,
    private injector: Injector
  ) {
    super();
  }

  override componentInit(): void {
    this.initForm(
      new FormGroup({
        content: new FormControl(
          (this.item.value as INotifyNoteItemText)?.content as unknown,
          [Validators.required]
        ),
      })
    );

    this.editor = new Editor();
  }

  override componentDestroyed(): void {
    this.editor.destroy();
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
