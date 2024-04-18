import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { UtilsService } from '../../../../services';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

@Component({
  selector: 'notify-tailwind-dropzone',
  templateUrl: './tailwind-dropzone.component.html',
  providers: [UtilsService],
  styles: `
    .dropzone {
      @apply border-2 border-current border-dashed bg-none rounded-md text-white flex flex justify-center items-center text-current;
      }
      `,
})
export class TailwindDropzoneComponent implements OnInit, OnChanges {
  @Input() parent!: FormGroup;
  @Input() labels: {
    defaultMessage: string;
    invalidFileType: string;
    cancelUpload: string;
    uploadCanceled: string;
    maxFilesExceeded: string;
    removeFileConfirmation: string;
    cancelUploadConfirmation: string;
  } = {
    defaultMessage: 'Trascina i file o fai click/tap qui per caricarli',
    invalidFileType: 'Tipo di file non valido',
    cancelUpload: 'Annulla caricamento',
    uploadCanceled: 'Caricamento annullato',
    maxFilesExceeded: 'Hai raggiunto il numero massimo di file',
    removeFileConfirmation: 'Sei sicuro di voler rimuovere questo file?',
    cancelUploadConfirmation: 'Sei sicuro di voler annullare il caricamento?',
  };
  @Input() name!: string;
  @Input() schema: { value: string; filename: string } = {
    value: 'url',
    filename: 'name',
  };
  @Input() acceptedFiles!: string;
  @Input() maxFileSize = 10;
  @Input() cdnConfig!: {
    postEndpoint: string;
    authorization: { [key: string]: string };
    body: { [key: string]: string };
    responseSchema: {
      value: string;
    };
  };

  @Input() validationErrors!: { [key: string]: string };
  @Input() maxFiles = 10;

  public dropzoneConfig?: DropzoneConfigInterface;

  constructor(private tailwindFormService: TailwindFormsService) {}

  ngOnInit(): void {
    this._setDropzoneConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['validationErrors']) {
      this.validationErrors =
        this.tailwindFormService.fillValidationErrorsWithMissing(
          this.parent.get(this.name),
          this.validationErrors
        );
    }
  }

  public onFileAdded(
    event: [
      File,
      {
        [key: string]: string;
      },
      Event
    ]
  ) {
    const currentFiles = this.parent.controls[this.name].value;

    this.parent.controls[this.name].setValue(
      currentFiles.concat({
        [this.schema.value]: event[1][this.cdnConfig.responseSchema.value],
        [this.schema.filename]: event[0].name,
      })
    );
  }

  get hasErrors() {
    return this.parent.get(this.name)?.errors;
  }

  get touched() {
    return this.parent.get(this.name)?.touched;
  }

  get showValidationErrors() {
    return this.hasErrors && this.touched;
  }

  get validationErrorMessage() {
    if (!this.hasErrors) {
      return '';
    }

    if (
      !this.validationErrors ||
      !this.validationErrors[Object.keys(this.hasErrors)[0]]
    ) {
      return 'Errore di validazione';
    }

    return this.validationErrors[Object.keys(this.hasErrors)[0]];
  }

  private _setDropzoneConfig() {
    this.dropzoneConfig = {
      url: this.cdnConfig.postEndpoint,
      maxFiles: this.maxFiles,
      acceptedFiles: this.acceptedFiles,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      maxFilesize: this.maxFileSize,
      headers: this.cdnConfig.authorization,
      dictDefaultMessage: this.labels.defaultMessage,
      dictInvalidFileType: this.labels.invalidFileType,
      dictCancelUpload: this.labels.cancelUpload,
      dictUploadCanceled: this.labels.uploadCanceled,
      dictMaxFilesExceeded: this.labels.maxFilesExceeded,
      dictRemoveFileConfirmation: this.labels.removeFileConfirmation,
      dictCancelUploadConfirmation: this.labels.cancelUploadConfirmation,
      params: this.cdnConfig.body,
    };
  }
}
