import {
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
  selector: 'notify-tailwind-slider',
  templateUrl: './tailwind-slider.component.html',
})
export class TailwindSliderComponent implements OnInit, OnChanges {
  @Input() parent!: FormGroup;
  @Input() label!: string;
  @Input() name!: string;
  @Input() helpText!: string;
  @Input() validationErrors!: { [key: string]: string };
  @Input() readOnly = false;
  @Input() min = 0;
  @Input() max = 100;
  @Input() steps = 10;
  @Input() compact = false;

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  public get stepsIterable() {
    return Array.from({ length: this.steps + 1 }, (_, i) => i);
  }

  public get step() {
    return (this.max - this.min) / this.steps;
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
