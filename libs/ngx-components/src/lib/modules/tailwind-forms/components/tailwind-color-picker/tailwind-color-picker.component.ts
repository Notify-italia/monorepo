import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

@Component({
  selector: 'notify-tailwind-color-picker',
  templateUrl: './tailwind-color-picker.component.html',
  styleUrls: ['./tailwind-color-picker.component.scss'],
})
export class TailwindColorPickerComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() parent!: FormGroup;
  @Input() label!: string;
  @Input() name!: string;
  @Input() helpText!: string;
  @Input() validationErrors!: { [key: string]: string };
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  public colorPickerOpen = false;
  public color = '#ffffff';

  private destroy$ = new Subject<void>();

  constructor(private tailwindFormService: TailwindFormsService) {}

  handleColorPickerChange() {
    this.parent.controls[this.name].setValue(this.color);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    const formColor = this.parent.controls[this.name].value;
    if (formColor.length) {
      this.color = formColor;
    }

    if (!this.label) {
      this.label = this.name;
    }

    this.parent.controls[this.name].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.color = value;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['validationErrors']) {
      this.validationErrors =
        this.tailwindFormService.fillValidationErrorsWithMissing(
          this.parent.get(this.name),
          this.validationErrors
        );
    }

    this.color = this.parent.controls[this.name].value;
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
