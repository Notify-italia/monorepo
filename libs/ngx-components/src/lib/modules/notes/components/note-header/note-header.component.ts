import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { INotifyNote } from '@notify/interfaces';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { NoteItemBase } from '../../note-item.base';

@Component({
  selector: 'notify-note-header',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './note-header.component.html',
  styleUrls: ['./note-header.component.scss', '../../notes.styles.scss'],
})
export class NoteHeaderComponent extends NoteItemBase {
  @Input({ required: true }) note!: INotifyNote;

  override componentReady() {
    this.initForm(
      new FormGroup({
        title: new FormControl(this.note.title),
        color: new FormControl(this.note.color),
      })
    );
  }
}
