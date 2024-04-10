import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyLicense, INotifyPopulatedLicense } from '@notify/interfaces';
import { Subject } from 'rxjs';
import { ModalBaseComponent } from '../../../../constructors';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  templateUrl: './license-form-full.component.html',
  styleUrl: './license-form-full.component.scss',
})
export class LicenseFormFullComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input() license!: INotifyPopulatedLicense;

  public form!: FormGroup;
  public submitted = new Subject<Partial<INotifyLicense>>();
  public deleteLicense = new Subject<string>();

  public ngOnInit(): void {
    this.form = new FormGroup({
      expirationDate: new FormControl(this.license?.expirationDate || null, []),
      enabled: new FormControl(this.license?.enabled ?? false, []),
      allowedAgents: new FormControl(this.license?.allowedAgents ?? 0, [
        Validators.required,
      ]),
      boughtCards: new FormControl(this.license?.boughtCards ?? 0, [
        Validators.required,
      ]),
    });
  }

  public save(): void {
    if (!this.form.valid) {
      return;
    }
    this.submitted.next(this.form.value);
    this.close();
  }
}
