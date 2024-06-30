import { Injectable } from '@angular/core';
import { INoitfyAPLeadItem } from '@notify/interfaces';
import { BaseFactory } from '../../../constructors';
import { ContactFormComponent } from './contact-form.component';

export interface IContactFormParams {
  owner: string;
  visibleFields: INoitfyAPLeadItem['fields'];
}

@Injectable()
export class ContactFormFactory extends BaseFactory {
  public create(config: IContactFormParams) {
    return this._createComponent<ContactFormComponent, IContactFormParams>(
      ContactFormComponent,
      config
    );
  }
}
