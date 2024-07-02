import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FEATURES,
  INotifyLicense,
  INotifyPopulatedLicense,
} from '@notify/interfaces';
import { Subject } from 'rxjs';
import { ModalBaseComponent } from '../../../../constructors';
import { FormsService } from '../../../../services';
import { ITailwindSelectOption } from '../../../tailwind-forms/components/tailwind-select/tailwind-select.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  providers: [FormsService],
  templateUrl: './license-form-full.component.html',
  styleUrl: './license-form-full.component.scss',
})
export class LicenseFormFullComponent
  extends ModalBaseComponent<Partial<INotifyLicense>>
  implements OnInit
{
  private _formsService = inject(FormsService);

  @Input() license!: INotifyPopulatedLicense;

  public form!: FormGroup;
  public deleteLicense = new Subject<string>();

  public featuresSelectOptions: ITailwindSelectOption[] = FEATURES.map(
    (feature) => ({
      value: feature,
      name: feature,
    })
  );

  public featuresTypeSelectOptions: ITailwindSelectOption[] = [
    {
      value: 'include',
      name: 'Includi',
    },
    {
      value: 'exclude',
      name: 'Escludi',
    },
  ];

  public ngOnInit(): void {
    this.form = new FormGroup({
      expirationDate: new FormControl(this.license?.expirationDate || null, []),
      enabled: new FormControl(this.license?.enabled ?? true, []),
      allowedAgents: new FormControl(this.license?.allowedAgents ?? 0, [
        Validators.required,
      ]),
      boughtCards: new FormControl(this.license?.boughtCards ?? 0, [
        Validators.required,
      ]),
      features: this._formsService.createFormArray(
        this.license?.features || []
      ),
    });
  }

  public addFeature(): void {
    (this.form.get('features') as FormArray).push(
      new FormGroup({
        type: new FormControl('', [Validators.required]),
        name: new FormControl('include', [Validators.required]),
      })
    );
  }

  public save(): void {
    if (!this.form.valid) {
      return;
    }
    this.submitted.next(this.form.value);
    this.close();
  }
}
