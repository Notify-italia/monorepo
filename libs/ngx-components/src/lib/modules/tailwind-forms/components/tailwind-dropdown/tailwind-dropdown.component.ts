import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TailwindFormsService } from '../../services/tailwind-forms.service';

@Component({
  selector: 'notify-tailwind-dropdown',
  templateUrl: './tailwind-dropdown.component.html',
})
export class TailwindDropdownComponent implements OnChanges {
  @Input() parent!: FormGroup;
  @Input() label!: string;
  @Input() name!: string;
  @Input() options!: { name: string | number; value: any }[];
  @Input() validationErrors!: { [key: string]: string };

  showOptions = false;
  filteredOptions!: any[];

  constructor(private tailwindFormService: TailwindFormsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredOptions = this.options;
    if (changes['validationErrors']) {
      this.validationErrors =
        this.tailwindFormService.fillValidationErrorsWithMissing(
          this.parent.get(this.name),
          this.validationErrors
        );
    }
  }

  public onMouseDown(event: any, item: any) {
    event.preventDefault();
    event.target['selected'] = !event.target['selected'];
    if (event.target['selected']) {
      this.parent.value.customerIds.push(item);
    } else {
      let index: number = -1;
      index = this.parent.value.customerIds.indexOf(item);
      if (index > -1) {
        this.parent.value.customerIds.splice(index);
      }
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

    return this.validationErrors[Object.keys(this.hasErrors)[0]];
  }

  filterItems(items: any) {
    if (!items.length) {
      this.filteredOptions = this.options;
    }
    this.filteredOptions = this.options.filter((i) =>
      i.name.toString().includes(items)
    );
  }
}
