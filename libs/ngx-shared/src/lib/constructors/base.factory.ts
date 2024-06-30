import { Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable()
export class BaseFactory {
  constructor(public vcr: ViewContainerRef) {}

  public _createComponent<T, D = { [key: string]: unknown }>(
    component: Type<T>,
    data?: D
  ) {
    const ref = this.vcr.createComponent<T>(component);

    ref.setInput('cf', ref);

    for (const key in data) {
      ref.setInput(key, data[key]);
    }

    return ref;
  }
}
