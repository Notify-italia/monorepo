import { Injectable, ViewContainerRef } from '@angular/core';
import { EnumNotifyUserType, INotifyAccounts } from '@notify/interfaces';
import { UserFormComponent } from './user-form.component';

@Injectable()
export class UserFormFactory {
  constructor(public vcr: ViewContainerRef) {}

  public createForm<T extends EnumNotifyUserType>(
    user?: INotifyAccounts[T],
    createdRoles?: string[]
  ) {
    const ref = this.vcr.createComponent(UserFormComponent);

    ref.setInput('cf', ref);
    ref.setInput('user', user);
    ref.setInput('createdRoles', createdRoles);

    return ref;
  }
}
