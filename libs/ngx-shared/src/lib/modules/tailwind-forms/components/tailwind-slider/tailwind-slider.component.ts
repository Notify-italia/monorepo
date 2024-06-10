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
  styles: `
  .bubble {
  @apply absolute left-1/2 transform -translate-x-1/2 rounded-xl bg-secondary-500 text-white p-1  text-xs -mt-7;
}`,
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
  @Input() stepsLabels?: {
    startLabel?: string;
    endLabel?: string;
    showCurrentStepWhileDragging?: boolean;
    stepPosition?: 'top' | 'bottom';
    showCurrentStep?: boolean;
    stepSuffix?: string;
    stepUsesPercentage?: boolean;
  };

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  public get stepsIterable() {
    return Array.from({ length: this.steps + 1 }, (_, i) => i);
  }

  public get step() {
    return (this.max - this.min) / this.steps;
  }

  public get currentValue() {
    return this.parent.get(this.name)?.value;
  }

  public get currentPercentage() {
    return ((this.currentValue - this.min) / (this.max - this.min)) * 100;
  }

  public get bubbleLeft() {
    return `calc(${this.currentPercentage}% + (${
      8 - this.currentPercentage * 0.15
    }px))`;
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
