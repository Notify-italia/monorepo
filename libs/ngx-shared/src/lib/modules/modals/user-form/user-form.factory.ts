import { Injectable } from '@angular/core';
import { EnumNotifyUserType, INotifyAccounts } from '@notify/interfaces';
import { BaseFactory } from '../../../constructors/base.factory';
import {
  IUserFormHiddenFields,
  IUserFormPasswordFieldConfig,
  UserFormComponent,
} from './user-form.component';

@Injectable()
export class UserFormFactory extends BaseFactory {
  public create<T extends EnumNotifyUserType>(
    user?: INotifyAccounts[T],
    createdRoles?: string[],
    hiddenFields?: IUserFormHiddenFields,
    passwordFieldConfig?: IUserFormPasswordFieldConfig
  ) {
    const ref = this._createComponent(UserFormComponent, {
      user,
      createdRoles: createdRoles || [],
      hiddenFields: hiddenFields || [],
    });

    if (passwordFieldConfig) {
      ref.setInput('passwordFieldConfig', passwordFieldConfig);
    }

    return ref;
  }
}
