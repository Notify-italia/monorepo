import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
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
export class ContactFormComponent extends ModalBaseComponent implements OnInit {
  private _formsService = inject(FormsService);
  private _leadsService = inject(LeadsService);

  @Input({ required: true }) owner!: string;
  @Input({ required: true }) visibleFields!: INoitfyAPLeadItem['fields'];

  public form = this._formsService.createFormGroup({
    name: '',
    email: '',
    surname: '',
    phone: '',
    acceptanceMessage: '',
    privacy: false,
  });

  public validationErrors = {
    required: '',
  };

  public ngOnInit(): void {
    const requiredFields = this.visibleFields.filter((field) => field.required);

    requiredFields.forEach((field) => {
      this.form.get(field.name)?.setValidators([Validators.required]);
    });

    this.form.get('privacy')?.setValidators([Validators.requiredTrue]);
  }

  public isVisible(field: INoitfyAPLeadItem['fields'][0]['name']) {
    return this.visibleFields.some(
      (visibleField) => visibleField.name === field
    );
  }

  public getFieldName(field: INoitfyAPLeadItem['fields'][0]['name']) {
    let _name = field.toLowerCase();
    switch (field) {
      case 'name':
        _name = 'Nome';
        break;
      case 'surname':
        _name = 'Cognome';
        break;
      case 'phone':
        _name = 'Telefono';
        break;
      case 'email':
        _name = 'Email';
        break;
      case 'acceptanceMessage':
        _name = 'Messaggio';
        break;
      default:
        _name = '';
        break;
    }

    return `${_name}${this._isRequired(field) ? '*' : ''}`;
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
        acceptanceMessage: this.form.value.acceptanceMessage || '',
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

  private _isRequired(field: INoitfyAPLeadItem['fields'][0]['name']) {
    return this.visibleFields.some(
      (visibleField) => visibleField.name === field && visibleField.required
    );
  }
}
