import {
  ApplicationRef,
  Injectable,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable()
export class BaseFactory {
  constructor(
    public vcr: ViewContainerRef,
    private applicationRef: ApplicationRef
  ) {}

  public _createComponent<T, D = { [key: string]: unknown }>(
    component: Type<T>,
    data?: D
  ) {
    const rootViewContainerRef = this.applicationRef.components[0].injector;

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
