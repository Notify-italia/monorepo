import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyNoteItemLink } from '@notify/interfaces';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { NoteItemBase } from '../../note-item.base';

@Component({
  selector: 'notify-note-link-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TailwindFormsModule,
  ],
  templateUrl: './note-link-item.component.html',
  styleUrls: ['./note-link-item.component.scss', '../../notes.styles.scss'],
})
export class NoteLinkItemComponent extends NoteItemBase {
  public formVisible = false;

  override componentReady(): void {
    const itemValue = this.item.value as INotifyNoteItemLink;

    this.initForm(
      new FormGroup({
        url: new FormControl(itemValue?.url, [Validators.required]),
        title: new FormControl(itemValue?.title, [Validators.required]),
      })
    );
  }
}
