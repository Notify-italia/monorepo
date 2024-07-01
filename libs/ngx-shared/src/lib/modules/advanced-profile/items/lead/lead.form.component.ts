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
    <table class="w-full h-full">
      <thead>
        <tr class="text-xs ">
          <th class="w-1/2 text-start">Campo</th>
          <th class="w-1/4">Visibile</th>
          <th class="w-1/4">Obbligatorio</th>
        </tr>
      </thead>
      <tbody>
        @for (item of form.controls.fields.controls; track $index) {
        <tr class="items-center h-10">
          <td>
            <small>{{ translatedFields[item.value.name || ''] }}</small>
          </td>
          <td>
            <notify-tailwind-checkbox
              [parent]="item"
              [compact]="true"
              [overrideToggleIcon]="context.components.checkbox.toggleEye"
              name="visible"
              label=" "
            ></notify-tailwind-checkbox>
          </td>
          <td>
            <notify-tailwind-checkbox
              [parent]="item"
              [compact]="true"
              [overrideToggleIcon]="context.components.checkbox.lockClosed"
              name="required"
              label=" "
            ></notify-tailwind-checkbox>
          </td>
        </tr>
        }
      </tbody>
    </table>
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
    acceptanceMessage: 'Messaggio',
    ['']: 'Campo non riconosciuto',
  };

  public override componentReady(): void {
    super.componentReady();

    this._compareFieldsWithList();
  }

  private _compareFieldsWithList(): void {
    const formFields = this.form.controls.fields.controls;
    const formFieldsNames = formFields
      .map((field) => field.value.name)
      .filter((v) => v) as FieldName[];

    const manifestFieldsNames =
      this.context.getters.manifest.definitions.fields.map((v) => v.name);

    const fieldsToBeAdded = manifestFieldsNames.filter(
      (field) => !formFieldsNames.includes(field)
    );

    fieldsToBeAdded.forEach((field) => {
      this.form.controls.fields.push(
        this.context.services.forms.createFormGroup(<
          INoitfyAPLeadItem['fields'][0]
        >{
          name: field,
          visible: false,
          required: false,
        })
      );
    });

    const fieldsToBeRemoved = formFieldsNames.filter(
      (field) => !manifestFieldsNames.includes(field)
    );

    fieldsToBeRemoved.forEach((field) => {
      const index = formFields.findIndex((f) => f.value.name === field);
      this.form.controls.fields.removeAt(index);
    });
  }
}
