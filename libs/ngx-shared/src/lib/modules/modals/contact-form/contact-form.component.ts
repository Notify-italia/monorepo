import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { INoitfyAPLeadItem } from '@notify/interfaces';
import { ModalBaseComponent } from '../../../constructors';
import { FormsService } from '../../../services';
import { TailwindFormsModule } from '../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, ReactiveFormsModule],
  providers: [FormsService],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent extends ModalBaseComponent {
  private _formsService = inject(FormsService);

  @Input({ required: true }) owner!: string;
  @Input({ required: true }) visibleFields!: INoitfyAPLeadItem['fields'];

  public form = this._formsService.createFormGroup({
    name: '',
    email: '',
    surname: '',
    phone: '',
    message: '',
  });

  public isVisible(field: INoitfyAPLeadItem['fields'][0]['name']) {
    return this.visibleFields.some(
      (visibleField) => visibleField.name === field
    );
  }
}
