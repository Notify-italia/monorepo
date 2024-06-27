import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalBaseComponent } from '../../../../constructors/modal.base.component';
import { CapacitorService } from '../../../../services';
import { UploadComponent } from '../../../../standalones/upload/upload.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TailwindFormsModule,
    UploadComponent,
  ],
  providers: [CapacitorService],
  templateUrl: './share-file-modal.component.html',
  styleUrl: './share-file-modal.component.scss',
})
export class ShareFileModalComponent extends ModalBaseComponent<File> {
  public desktopMessage = `Fai click per caricare un file o trascinalo all'interno del riquadro`;
  public mobileMessage = `Tocca per caricare un file`;

  public form = new FormGroup<{
    file: FormControl<File | null>;
  }>({
    file: new FormControl(null, Validators.required),
  });

  constructor(public _capacitor: CapacitorService) {
    super();
  }

  public setUploadedFile(file: File | null) {
    this.form.controls.file.setValue(file);
  }

  public submit() {
    if (!this.form.valid || !this.form.value.file) {
      return;
    }

    this.submitted.next(this.form.value.file);

    this.close();
  }
}
