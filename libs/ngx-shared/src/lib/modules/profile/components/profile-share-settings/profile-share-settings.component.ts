import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { Validators } from 'ngx-editor';
import { Subject, debounceTime, tap } from 'rxjs';
import { ModalBaseComponent } from '../../../../constructors';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  templateUrl: './profile-share-settings.component.html',
  styleUrl: './profile-share-settings.component.scss',
})
export class ProfileShareSettingsComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input({ required: true }) profile!: INotifyProfile;
  @Input({ required: true }) baseUrl!: string;

  public loading = false;

  public valid: 'success' | 'error' | 'pending' | '' = '';
  public iconClass = 'w-6 h-6';

  public validationErrors = {
    minLength: 'almeno 2 caratteri',
  };

  public submitted = new Subject<{
    profileIdentifier: string;
  }>();

  public checkAvailability = new Subject<string>();

  public form!: FormGroup;

  public get trimmedProfileIdentifier(): string {
    return this.form.value.profileIdentifier?.toLowerCase().replace(/\s/g, '-');
  }

  public get displayFriendlyUrl() {
    return this.baseUrl.replace('https://', '').replace('http://', '');
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      profileIdentifier: new FormControl(
        this.profile.profileIdentifier || '',
        Validators.minLength(2)
      ),
    });

    this.form.valueChanges
      .pipe(
        tap(() => {
          this.form.controls['profileIdentifier'].setValue(
            this.trimmedProfileIdentifier,
            { emitEvent: false }
          );

          if (
            this.trimmedProfileIdentifier === this.profile.profileIdentifier ||
            !this.form.valid ||
            !this.trimmedProfileIdentifier
          ) {
            this.valid = '';
            return;
          }
          this.valid = 'pending';
        }),
        debounceTime(500)
      )
      .subscribe(() => {
        if (!this.valid) {
          return;
        }
        this.checkAvailability.next(this.trimmedProfileIdentifier);
      });
  }
  public submit() {
    if (!this.form.valid || !this.trimmedProfileIdentifier) {
      return;
    }

    this.submitted.next({ profileIdentifier: this.trimmedProfileIdentifier });
  }
}
