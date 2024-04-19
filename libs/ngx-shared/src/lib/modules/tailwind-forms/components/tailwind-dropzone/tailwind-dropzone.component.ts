import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DropzoneConfigInterface,
  DropzoneDirective,
} from 'ngx-dropzone-wrapper';
import { Subject, takeUntil, tap } from 'rxjs';
import { UtilsService } from '../../../../services';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

export interface INotifyTailwindDropzoneCdnConfig {
  postEndpoint: string;
  deleteEndpoint: string;
  authorization: { [key: string]: string };
  body: { [key: string]: string };
  deleteSchema: {
    name: string;
  };
  deleteExtraParams: {
    [key: string]: string;
  };
  responseSchema: {
    value: string;
  };
}

@Component({
  selector: 'notify-tailwind-dropzone',
  templateUrl: './tailwind-dropzone.component.html',
  providers: [UtilsService],
  styleUrls: ['./tailwind-dropzone.component.scss'],
})
export class TailwindDropzoneComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  private _utilsService = inject(UtilsService);
  private _httpService = inject(HttpClient);

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
    defaultMessage:
      'Trascina i file o fai click/tap qui per caricarli (massimo 10 files)',
    invalidFileType: 'Tipo di file non valido',
    cancelUpload: 'Annulla caricamento',
    uploadCanceled: 'Caricamento annullato',
    maxFilesExceeded: 'Hai raggiunto il numero massimo di file',
    removeFileConfirmation: 'Sei sicuro di voler rimuovere questo file?',
    cancelUploadConfirmation: 'Sei sicuro di voler annullare il caricamento?',
  };
  @Input() name!: string;
  @Input() schema = {
    value: 'url',
    name: 'name',
    size: 'size',
    type: 'type',
  };
  @Input() acceptedFiles!: string;
  @Input() maxFileSize = 10;
  @Input() cdnConfig!: INotifyTailwindDropzoneCdnConfig;

  @Input() validationErrors!: { [key: string]: string };
  @Input() maxFiles = 10;

  @ViewChild(DropzoneDirective) dropzoneDirective!: DropzoneDirective;

  public dropzoneConfig?: DropzoneConfigInterface;
  public destroy$ = new Subject<void>();

  constructor(private tailwindFormService: TailwindFormsService) {}

  ngOnInit(): void {
    this._setDropzoneConfig();
  }

  ngAfterViewInit() {
    this.appendFiles();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  public async appendFiles() {
    const currentFiles: {
      dataURL: string;
      name: string;
      size: number;
      type: string;
    }[] = this.parent.controls[this.name].value.map(
      (v: Record<string, unknown>) => ({
        dataURL: v[this.schema.value],
        name: v[this.schema.name],
        size: v[this.schema.size],
        type: v[this.schema.type],
      })
    );

    const dz = this.dropzoneDirective.dropzone();

    await this._utilsService.asyncForEach(currentFiles, async (file) => {
      dz.files.push(file);
      dz.emit('addedfile', file);
      if (!file.type.includes('image')) {
        dz.emit('complete', file);
        return;
      }

      const dataURL = (await fetch(file.dataURL)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
        )) as string;

      file.dataURL = dataURL;

      dz.createThumbnailFromUrl(
        file,
        dz.options.thumbnailWidth,
        dz.options.thumbnailHeight,
        dz.options.thumbnailMethod,
        true,
        (thumbnail: Event) => {
          dz.emit('thumbnail', file, thumbnail);
          dz.emit('complete', file);
        }
      );
    });

    dz.options.maxFiles = this.maxFiles - currentFiles.length;
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
        [this.schema.name]: event[0].name,
        [this.schema.size]: event[0].size,
        [this.schema.type]: event[0].type,
      })
    );
  }

  public onFileRemoved(event: File) {
    const currentFiles = this.parent.controls[this.name].value;

    this._httpService
      .delete(this.cdnConfig.deleteEndpoint, {
        params: {
          [this.cdnConfig.deleteSchema.name]: event.name,
          ...this.cdnConfig.deleteExtraParams,
        },
        headers: this.cdnConfig.authorization,
      })
      .pipe(
        takeUntil(this.destroy$),
        tap(() =>
          this.parent.controls[this.name].setValue(
            currentFiles.filter(
              (file: Record<string, unknown>) =>
                file[this.schema.name] !== event.name
            )
          )
        )
      )
      .subscribe();
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
      dictResponseError: 'Errore durante il caricamento',
      dictFileTooBig: 'Il file è troppo pesante',
      dictRemoveFile: 'Rimuovi',
      addRemoveLinks: true,
      params: this.cdnConfig.body,
    } as DropzoneConfigInterface;
  }
}
