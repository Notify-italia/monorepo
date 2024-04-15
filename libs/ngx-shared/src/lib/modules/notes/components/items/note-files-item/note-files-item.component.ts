import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { INotifyNoteItemFiles, INotifyNoteItemLink } from '@notify/interfaces';
import { NoteItemBaseComponent } from '../../../../../constructors/note-item.base.component';
import { UtilsService } from '../../../../../services';
import { UploadComponent } from '../../../../../standalones';
import { TailwindFormsModule } from '../../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-note-files-item',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    UploadComponent,
  ],
  templateUrl: './note-files-item.component.html',
  styleUrls: ['./note-files-item.component.scss', '../../../notes.styles.scss'],
})
export class NoteFilesItemComponent extends NoteItemBaseComponent {
  public formVisible = false;

  constructor(
    private _domSanitizer: DomSanitizer,
    private _utilsService: UtilsService
  ) {
    super();
  }

  override componentInit(): void {
    const itemValue = this.item.value as INotifyNoteItemFiles;

    this.initForm(
      new FormGroup({
        files: new FormArray(
          (itemValue?.files || []).map(
            (file) =>
              new FormGroup({
                name: new FormControl(file.name),
                url: new FormControl(file.url),
              })
          )
        ),
      })
    );

    this.formVisible = !(this.item.value as INotifyNoteItemLink)?.url;
  }
}
