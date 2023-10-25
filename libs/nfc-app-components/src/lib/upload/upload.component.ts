import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'notify-upload',
  standalone: true,
  imports: [NgxDropzoneModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnChanges {
  @Input() disabled = false;
  @Input() acceptedFiles = '*';

  @Input()
  uploadLabel = `Fai click per caricare un file, oppure trascinalo in questo riquadro`;
  @Input() file: File | null = null;

  public blob?: string | ArrayBuffer | null;

  @Output() fileChanged = new EventEmitter<{
    file: File | null;
    blob: string | ArrayBuffer | null;
  }>();

  ngOnChanges() {
    if (!this.file) {
      this.blob = null;
      this.file = null;
    }
  }

  constructor(private _toastr: ToastrService) {}

  public async onSelectFile(event: NgxDropzoneChangeEvent) {
    if (event.rejectedFiles.length) {
      this._toastr.error('Formato file non valido');
      return;
    }

    const file = event.addedFiles[0];

    this.file = file;

    const buffer = await file.arrayBuffer();
    const srcBlob = await this._arrayBufferToBase64(buffer);
    this.blob = srcBlob;

    this.fileChanged.emit({
      file: this.file,
      blob: this.blob,
    });
  }

  public onRemoveFile() {
    this.file = null;
    this.blob = null;

    this.fileChanged.emit({
      file: this.file,
      blob: this.blob,
    });
  }

  private async _arrayBufferToBase64(buffer: ArrayBuffer) {
    //arraybuffer to blob
    const blob = new Blob([buffer]);

    const result = new Promise<string | ArrayBuffer | null>((resolve) => {
      //blob to base64 without using FileReader
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        return resolve(reader.result);
      };
    });

    return result;
  }
}
