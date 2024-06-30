import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EnumNotifyLeadOrigins, INoitfyAPLeadItem } from '@notify/interfaces';
import { catchError, of, tap } from 'rxjs';
import { ModalBaseComponent } from '../../../constructors';
import { FormsService, LeadsService } from '../../../services';
import { TailwindFormsModule } from '../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, ReactiveFormsModule],
  providers: [FormsService, LeadsService],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent extends ModalBaseComponent {
  private _formsService = inject(FormsService);
  private _leadsService = inject(LeadsService);

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

  public submit() {
    if (!this.form.valid) {
      return;
    }

    this._leadsService
      .createLead({
        createdBy: this.owner,
        name: this.form.value.name || '',
        surname: this.form.value.surname || '',
        emails: [this.form.value.email || ''],
        phoneNumbers: [this.form.value.phone || ''],
        origin: EnumNotifyLeadOrigins.ProfileContactForm,
        acceptanceMessage: this.form.value.message || '',
        color: '',
      })
      .pipe(
        catchError(() => of(null)),
        tap(() => {
          this.close();
        })
      )
      .subscribe();
  }
}
