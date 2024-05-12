import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'notify-tailwind-checkbox',
  templateUrl: './tailwind-checkbox.component.html',
})
export class TailwindCheckboxComponent implements OnInit {
  private _domSanitizer = inject(DomSanitizer);

  @Input() parent!: FormGroup;
  @Input() label!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() compact = false;

  @Input() validationErrors!: { [key: string]: string };
  /**
   * Override the default toggle icon, accepts HTML elements
   */
  @Input() overrideToggleIcon?: {
    checked: string;
    unchecked: string;
    button?: string;
  };

  ngOnInit(): void {
    if (!this.label) {
      this.label = this.name;
    }
  }

  get toggleIcon() {
    return this._domSanitizer.bypassSecurityTrustHtml(
      this.parent.get(this.name)?.value
        ? this.overrideToggleIcon?.checked || '<svg></svg>'
        : this.overrideToggleIcon?.unchecked || '<svg></svg>'
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

  toggleCheckbox() {
    this.parent.get(this.name)?.setValue(!this.parent.get(this.name)?.value);
  }
}
