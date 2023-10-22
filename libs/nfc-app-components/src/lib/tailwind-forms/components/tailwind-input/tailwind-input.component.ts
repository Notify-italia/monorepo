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
import { FormGroup } from '@angular/forms';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

@Component({
  selector: 'notify-tailwind-input',
  templateUrl: './tailwind-input.component.html',
  styleUrls: ['./tailwind-input.component.scss'],
})
export class TailwindInputComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() parent!: FormGroup;
  @Input() label!: string;
  @Input() name!: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() helpText!: string;
  @Input() showToggleEye = false;
  @Input() placeholder = '';
  @Input() validationErrors!: { [key: string]: string };
  @Input() disableAutocomplete = false;
  @Input() mask!: string;
  @Input() thousandSeparator!: string;
  @Input() patterns!: {
    [character: string]: {
      pattern: RegExp;
      optional?: boolean;
      symbol?: string;
    };
  };

  @Input() prefix = '';
  @Input() suffix = '';

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

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
    if (this.disableAutocomplete) {
      this.inputRef.nativeElement.setAttribute('autocomplete', 'off');
      this.inputRef.nativeElement.setAttribute('autocorrect', 'off');
      this.inputRef.nativeElement.setAttribute('autocapitalize', 'none');
      this.inputRef.nativeElement.setAttribute('spellcheck', 'false');
    }
  }

  togglePasswordVisibility() {
    if (this.inputRef.nativeElement.type === 'text') {
      return (this.inputRef.nativeElement.type = 'password');
    }

    return (this.inputRef.nativeElement.type = 'text');
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
