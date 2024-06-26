import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { UtilsService } from './utils.service';

export type controlsFromObject<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? FormGroup<controlsFromObject<T[K]>>
    : T[K] extends unknown[]
    ? FormArray<FormGroup<controlsFromObject<T[K][0]>>>
    : FormControl<T[K]>;
};

@Injectable()
export class FormsService {
  private _utilsService = inject(UtilsService);

  public createFormGroup<T>(object: T, defaults?: Partial<T>) {
    const controls = Object.keys(
      (object || {}) as Record<string, unknown>
    ).reduce(
      (acc: Record<string, FormControl | FormGroup | FormArray>, key) => {
        const value = object[key as keyof object] as unknown;

        if (value === null || value === undefined) {
          acc[key] = new FormControl(defaults?.[key as keyof object]);
          return acc;
        }

        if (Array.isArray(value)) {
          acc[key] = new FormArray(
            value.map((v, _index) => {
              if (['string', 'number', 'boolean'].includes(typeof v)) {
                return new FormGroup({
                  [_index]: new FormControl(
                    v ?? defaults?.[key as keyof object]
                  ),
                });
              }

              return this.createFormGroup(v, defaults?.[key as keyof object]);
            })
          );

          return acc;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          acc[key] = this.createFormGroup(
            value,
            defaults?.[key as keyof object]
          );
          return acc;
        }

        acc[key] = new FormControl(value ?? defaults?.[key as keyof object]);

        return acc;
      },
      {} as controlsFromObject<T>
    );

    return new FormGroup(controls) as FormGroup<controlsFromObject<T>>;
  }

  public createFormArray<T>(array: T[], defaults?: Partial<T>) {
    return new FormArray(array.map((v) => this.createFormGroup(v, defaults)));
  }

  public createFormControl<T>(object: T, path: string, defaults?: Partial<T>) {
    const currentValue = this._utilsService.deepSearchKey(
      object as Record<string, unknown>,
      path
    )[0];
    const defaultValue = this._utilsService.deepSearchKey(
      defaults ?? {},
      path
    )[0];

    return new FormControl(currentValue ?? defaultValue);
  }
}
