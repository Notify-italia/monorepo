import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

@Component({
  selector: 'notify-tailwind-dropzone',
  templateUrl: './tailwind-dropzone.component.html',
  styles: `
    .dropzone {
      @apply border-2 border-gray-400 border-dashed bg-none rounded-md text-white flex flex justify-center items-center;

      }
      `,
})
export class TailwindDropzoneComponent
  implements OnChanges, OnInit, AfterViewInit
{
  @Input() parent!: FormArray;
  @Input() label =
    'Carica i tuoi files trascinandoli qui o facendo click/tap su questa area.';
  @Input() name!: string;
  @Input() acceptedFiles!: string;
  @Input() cdnConfig!: {
    postEndpoint: string;
    authorization: { [key: string]: string };
  };

  @Input() validationErrors!: { [key: string]: string };
  @Input() maxFiles = 10;

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  public get dropzoneConfig(): DropzoneConfigInterface {
    return {
      url: this.cdnConfig.postEndpoint,
      maxFiles: this.maxFiles,
      acceptedFiles: this.acceptedFiles,
      autoReset: null,
      errorReset: null,
      cancelReset: null,
      headers: this.cdnConfig.authorization,
      dictDefaultMessage: this.label,
    };
  }

  constructor(private tailwindFormService: TailwindFormsService) {}

  ngOnInit(): void {
    if (!this.label) {
      this.label = this.name;
    }
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

  ngAfterViewInit(): void {
    return;
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
}
