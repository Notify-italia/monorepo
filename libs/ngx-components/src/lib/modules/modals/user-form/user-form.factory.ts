import { Injectable, ViewContainerRef } from '@angular/core';
import { EnumNotifyUserType, INotifyAccounts } from '@notify/interfaces';
import {
  IUserFormHiddenFields,
  UserFormComponent,
} from './user-form.component';

@Injectable()
export class UserFormFactory {
  constructor(public vcr: ViewContainerRef) {}

  public create<T extends EnumNotifyUserType>(
    user?: INotifyAccounts[T],
    createdRoles?: string[],
    hiddenFields?: IUserFormHiddenFields
  ) {
    const ref = this.vcr.createComponent(UserFormComponent);

    ref.setInput('cf', ref);
    ref.setInput('user', user);
    ref.setInput('createdRoles', createdRoles);
    ref.setInput('hiddenFields', hiddenFields);

    return ref;
  }
}
