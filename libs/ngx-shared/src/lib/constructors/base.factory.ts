import {
  ApplicationRef,
  Injectable,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable()
export class BaseFactory {
  constructor(
    public vcr: ViewContainerRef,
    public applicationRef: ApplicationRef
  ) {}

  public _createComponent<T, D = { [key: string]: unknown }>(
    component: Type<T>,
    data?: D,
    parentInjector?: Injector
  ) {
    const rootViewContainerRef =
      parentInjector || this.applicationRef.components[0].injector;

    const ref = this.vcr.createComponent<T>(component, {
      injector: rootViewContainerRef,
    });

    ref.setInput('cf', ref);

    for (const key in data) {
      ref.setInput(key, data[key]);
    }

    return ref;
  }
}
