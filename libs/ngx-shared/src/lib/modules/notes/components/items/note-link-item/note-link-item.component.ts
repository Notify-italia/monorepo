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
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import { UtilsService } from '../../../../../services';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';

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
export class NoteLinkItemComponent extends NoteItemBaseComponent {
  public formVisible = false;

  public get redirectUrl() {
    const url = this.form.get('url')?.value;

    if (!url) {
      return null;
    }

    return this._domSanitizer.bypassSecurityTrustResourceUrl(
      this._utilsService.populateWebProtocol('https://', url)
    );
  }

  constructor(
    private _domSanitizer: DomSanitizer,
    private _utilsService: UtilsService
  ) {
    super();
  }

  override componentInit(): void {
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
