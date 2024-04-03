/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Compiler,
  Injectable,
  Injector,
  NgModuleFactory,
  NgModuleRef,
  Type,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicModuleLoaderService {
  constructor(private compiler: Compiler, private injector: Injector) {
    console.log('Dynamic Module Loader is loaded!');
  }

  loadModule(m: any): Promise<NgModuleRef<any>> {
    return m
      .then((elementModuleOrFactory: Type<unknown>) => {
        if (elementModuleOrFactory instanceof NgModuleFactory) {
          // if ViewEngine
          return elementModuleOrFactory;
        } else {
          // if Ivy
          return this.compiler.compileModuleAsync(elementModuleOrFactory);
        }
      })
      .then((moduleFactory: { create: (arg0: Injector) => any }) =>
        moduleFactory.create(this.injector)
      );
  }
}
