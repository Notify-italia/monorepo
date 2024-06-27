import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnknownType } from '@notify/interfaces';
import { ModalBaseComponent } from '../../../../constructors/modal.base.component';
import { SvgBoxIconComponent } from '../../../../standalones/svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-license-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgBoxIconComponent,
  ],
  templateUrl: './license-form.component.html',
  styleUrl: './license-form.component.scss',
})
export class LicenseFormComponent extends ModalBaseComponent<string> {
  @ViewChildren('LicenseInput') licenseInputs!: QueryList<ElementRef>;

  public loading = false;

  private _validators = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(8),
  ];

  public form = new FormGroup({
    part0: new FormControl('', this._validators),
    part1: new FormControl('', this._validators),
    part2: new FormControl('', this._validators),
    part3: new FormControl('', this._validators),
  });

  public get inputsConfig() {
    return new Array(4).fill(0).map((_, i) => ({
      maxLength: 8,
      name: `part${i}`,
      placeholder: 'ABCD1234',
    }));
  }

  public submit(): void {
    if (!this.form.valid) {
      return;
    }

    const { part0, part1, part2, part3 } = this.form.value;

    this.submitted.next(`${part0}-${part1}-${part2}-${part3}`.toUpperCase());

    this.close();
  }

  public handlePaste(event: ClipboardEvent, index: number, maxLength: number) {
    event.preventDefault();

    //remove all non-alphanumeric characters from the clipboard text
    const cleanedClipboardText = event.clipboardData
      ?.getData('text')
      ?.replace(/[^a-zA-Z0-9]/g, '');

    if (!cleanedClipboardText?.length) {
      return;
    }

    //divide the clipboard text into an array of strings of length 8
    const clipboardTextParts = cleanedClipboardText?.match(
      new RegExp(`.{1,${maxLength}}`, 'g')
    );

    if (!clipboardTextParts) {
      return;
    }

    //if there are more than 4 parts, take the first 4
    const parts = clipboardTextParts.slice(0, 4);

    //for each part, update the corresponding input
    parts.forEach((part, i) => {
      const currentInput = (this.form.controls as UnknownType)[
        `part${index + i}`
      ] as FormControl;

      if (!currentInput) {
        return;
      }

      currentInput.setValue(part);
    });
  }

  public handleLicenseInput(
    event: KeyboardEvent,
    index: number,
    maxLength: number
  ) {
    const currentInput = (this.form.controls as UnknownType)[
      `part${index}`
    ] as FormControl;
    const cValue = currentInput.value;

    const nextInput: HTMLInputElement = this.licenseInputs.get(
      index + 1
    )?.nativeElement;
    const previousInput: HTMLInputElement = this.licenseInputs.get(
      index - 1
    )?.nativeElement;

    if (!currentInput) {
      return;
    }

    const isBackspace = event.key === 'Backspace';
    const isTab = event.key === 'Tab';

    //if the key isn't alphanumeric or backspace prevent the default behavior
    if (!event.key.match(/^[a-zA-Z0-9]$/) && !isBackspace && !isTab) {
      event.preventDefault();
      return;
    }

    //if the input is already full, move to the next input if it exists
    if (cValue.length >= maxLength && nextInput && !isBackspace) {
      nextInput?.focus();
      return;
    }

    //if the input is empty, move to the previous input if it exists
    if (cValue.length === 0 && previousInput && isBackspace) {
      previousInput?.focus();
      return;
    }

    return;
  }
}
