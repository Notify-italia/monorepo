import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'notify-tailwind-checkbox',
  templateUrl: './tailwind-checkbox.component.html',
})
export class TailwindCheckboxComponent implements OnInit {
  @Input() parent!: FormGroup;
  @Input() label!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() validationErrors!: { [key: string]: string };

  ngOnInit(): void {
    if (!this.label) {
      this.label = this.name;
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
