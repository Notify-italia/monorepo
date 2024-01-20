import { CommonModule } from '@angular/common';
import { Component, ComponentRef, HostListener, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CapacitorService } from '@notify/nfc-app-services';
import { Subject } from 'rxjs';
import { UploadComponent } from '../../../../standalones/upload/upload.component';
import { QrcodeComponent } from '../../../modals';
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
export class ShareFileModalComponent {
  @Input() cf!: ComponentRef<QrcodeComponent>;

  public desktopMessage = `Fai click per caricare un file o trascinalo all'interno del riquadro`;
  public mobileMessage = `Tocca per caricare un file`;

  public submitted = new Subject<File>();
  public form = new FormGroup<{
    file: FormControl<File | null>;
  }>({
    file: new FormControl(null, Validators.required),
  });

  constructor(public _capacitor: CapacitorService) {}

  public setUploadedFile(file: File | null) {
    this.form.controls.file.setValue(file);
  }

  @HostListener('document:keydown.escape')
  close() {
    this.cf.destroy();
  }

  public submit() {
    if (!this.form.valid || !this.form.value.file) {
      return;
    }

    this.submitted.next(this.form.value.file);

    this.cf.destroy();
  }
}
