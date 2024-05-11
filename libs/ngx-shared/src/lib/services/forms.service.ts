import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilsService } from './utils.service';

@Injectable()
export class FormsService {
  private _utilsService = inject(UtilsService);

  public createFormGroup<T>(object: T) {
    const controls = Object.keys(object as Record<string, unknown>).reduce(
      (acc, key) => {
        const value = object[key as keyof object];

        acc[key] = new FormControl(value);

        return acc;
      },
      {} as Record<string, FormControl | FormGroup>
    );
    return new FormGroup(controls);
  }

  public createFormControl<T>(object: T, path: string, defaults?: Partial<T>) {
    const currentValue = this._utilsService.deepSearchKey(
      object as Record<string, unknown>,
      path
    );
    const defaultValue = this._utilsService.deepSearchKey(defaults ?? {}, path);

    return new FormControl(currentValue ?? defaultValue);
  }
}
