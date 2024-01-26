import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyNoteItemLink } from '@notify/interfaces';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';
import { NoteItemBase } from '../note-item.base';

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
  styleUrls: ['./note-link-item.component.scss', '../../../notes.styles.scss'],
})
export class NoteLinkItemComponent extends NoteItemBase {
  public formVisible = false;

  public get redirectUrl() {
    let url = this.form.get('url')?.value;

    if (!url) {
      return null;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor(private _domSanitizer: DomSanitizer) {
    super();
  }

  override componentReady(): void {
    const itemValue = this.item.value as INotifyNoteItemLink;

    this.initForm(
      new FormGroup({
        url: new FormControl(itemValue?.url, [Validators.required]),
        title: new FormControl(itemValue?.title, [Validators.required]),
      })
    );

    this.formVisible = !(this.item.value as INotifyNoteItemLink)?.url;
  }
}
