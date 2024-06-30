import { Component } from '@angular/core';

import { INoitfyAPLeadItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';

type FieldName = INoitfyAPLeadItem['fields'][0]['name'];

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: ` <div class="flex flex-col space-y-4 items-center">
    <notify-tailwind-select
      [parent]="form"
      name="style"
      label="Stile Pulsante"
      [options]="context.components.select.buttonStyles"
      class="w-full"
      [compact]="true"
    ></notify-tailwind-select>
    <notify-tailwind-input
      [compact]="true"
      [parent]="form"
      class="w-full"
      [showClearInput]="false"
      name="buttonLabel"
      placeholder="Lascia il tuo contatto"
      label="Titolo Pulsante"
    ></notify-tailwind-input>

    <div class="divider"></div>

    <small class="w-full">Visiblità dei campi nel form </small>
    @for (item of form.controls.fields.controls; track $index) {
    <notify-tailwind-checkbox
      class="w-full"
      [parent]="item"
      [compact]="true"
      [overrideToggleIcon]="context.components.checkbox.toggleEye"
      name="visible"
      [label]="translatedFields[item.value.name || '']"
    ></notify-tailwind-checkbox>
    }
  </div>`,
})
export class LeadFormComponent extends AdvancedProfileItemFormBaseComponent<INoitfyAPLeadItem> {
  public translatedFields: {
    [key: string | FieldName]: string;
  } = {
    email: 'Email',
    phone: 'Numero di telefono',
    name: 'Nome',
    surname: 'Cognome',
    instagram: 'Instagram',
    ['']: 'Campo non riconosciuto',
  };

  public override componentReady(): void {
    super.componentReady();

    this._compareFieldsWithList();
  }

  private _compareFieldsWithList(): void {
    const fields = this.form.controls.fields.controls;
    const fieldsNames = fields
      .map((field) => field.value.name)
      .filter((v) => v) as FieldName[];
    const fieldsToBeAdded = EDITABLE_FORM_FIELDS.filter(
      (field) => !fieldsNames.includes(field)
    );

    fieldsToBeAdded.forEach((field) => {
      this.form.controls.fields.push(
        this.context.services.forms.createFormGroup(<
          INoitfyAPLeadItem['fields'][0]
        >{
          name: field,
          visible: false,
        })
      );
    });

    const fieldsToBeRemoved = fieldsNames.filter(
      (field) => !EDITABLE_FORM_FIELDS.includes(field)
    );

    fieldsToBeRemoved.forEach((field) => {
      const index = fields.findIndex((f) => f.value.name === field);
      this.form.controls.fields.removeAt(index);
    });
  }
}

const EDITABLE_FORM_FIELDS: FieldName[] = ['name', 'surname', 'phone', 'email'];
