import { Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable()
export class BaseFactory {
  constructor(public vcr: ViewContainerRef) {}

  public _createComponent<T>(
    component: Type<T>,
    data?: { [key: string]: unknown }
  ) {
    const ref = this.vcr.createComponent<T>(component);

    ref.setInput('cf', ref);

    for (const key in data) {
      ref.setInput(key, data[key]);
    }

    return ref;
  }
}
