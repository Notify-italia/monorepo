import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNote, INotifyNoteItemText } from '@notify/interfaces';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { NoteItemBase } from '../../note-item.base';

@Component({
  selector: 'notify-note-text-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './note-text-item.component.html',
  styleUrls: ['./note-text-item.component.scss', '../../notes.styles.scss'],
})
export class NoteTextItemComponent extends NoteItemBase {
  @Input({ required: true }) item!: INotifyNote['items'][0];

  public editor!: Editor;

  override componentReady(): void {
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
}
