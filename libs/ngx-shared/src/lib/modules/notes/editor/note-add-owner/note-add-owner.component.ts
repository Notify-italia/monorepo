import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyUser } from '@notify/interfaces';
import { Observable, map } from 'rxjs';
import {
  ModalBaseComponent,
  baseModalComponentProviders,
} from '../../../../constructors/modal.base.component';
import { ProfileService } from '../../../../services';
import { LoadingComponent } from '../../../../standalones/loading/loading.component';
import { ITailwindSelectOption } from '../../../tailwind-forms/components/tailwind-select/tailwind-select.component';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    ReactiveFormsModule,
    FormsModule,
    TailwindFormsModule,
  ],
  providers: baseModalComponentProviders,
  selector: 'notify-note-add-owner',
  templateUrl: './note-add-owner.component.html',
  styleUrl: './note-add-owner.component.scss',
})
export class NoteAddOwnerComponent
  extends ModalBaseComponent<{
    user: string;
    sendNotification: boolean;
  }>
  implements OnInit
{
  private _profileService = inject(ProfileService);

  @Input() users$ = new Observable<INotifyUser[]>();
  @Input() loading = false;

  public enrichedUsers$!: Observable<{
    users: INotifyUser[];
    formData: {
      userSelect: ITailwindSelectOption[];
    };
  }>;

  override onInit() {
    this.enrichedUsers$ = this.users$.pipe(
      map((users) => ({
        users,
        formData: {
          userSelect: this.mapUsers(users),
        },
      }))
    );
  }

  public validationErrors = {
    required: 'Campo obbligatorio',
  };

  public form = new FormGroup({
    user: new FormControl('', Validators.required),
    sendNotification: new FormControl(true),
  });

  public mapUsers(u: INotifyUser[]) {
    return u.map((u) => {
      if (!u.profile) {
        return {
          name: u.email || 'Ignoto',
          value: u._id,
        };
      }

      const name = this._profileService.getProfileName(u.profile);
      const hasName = name.replace(/\s/g, '').length;

      return {
        name: hasName ? name : u.email || 'Ignoto',
        value: u._id,
      };
    });
  }

  public submit() {
    if (!this.form.valid) {
      return;
    }

    this.submitted.next({
      user: this.form.value.user as string,
      sendNotification: this.form.value.sendNotification as boolean,
    });

    this.loading = true;
  }
}
