import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { Subject } from 'rxjs';
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

  public submitted = new Subject<{
    profileIdentifier: string;
  }>();

  public form!: FormGroup;

  public ngOnInit(): void {
    this.form = new FormGroup({
      profileIdentifier: new FormControl(this.profile.profileIdentifier || ''),
    });
  }
  public submit() {
    if (!this.form.valid || !this.form.value) {
      return;
    }

    this.submitted.next(this.form.value);
  }
}
