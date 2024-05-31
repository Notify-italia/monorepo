import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyAPAvatarItem, INotifyUser } from '@notify/interfaces';
import { Observable, Subject, map } from 'rxjs';
import { ModalBaseComponent } from '../../../../constructors/modal.base.component';
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
  selector: 'notify-note-add-owner',
  templateUrl: './note-add-owner.component.html',
  styleUrl: './note-add-owner.component.scss',
})
export class NoteAddOwnerComponent
  extends ModalBaseComponent
  implements OnInit
{
  @Input() users$ = new Observable<INotifyUser[]>();
  @Input() loading = false;

  public submitted = new Subject<{
    user: string;
    sendNotification: boolean;
  }>();

  public enrichedUsers$!: Observable<{
    users: INotifyUser[];
    formData: {
      userSelect: ITailwindSelectOption[];
    };
  }>;

  public ngOnInit() {
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
      const apAvatar = u.profile?.advancedProfile?.items.find(
        (i) => i._id === u.profile?.advancedProfile?.requiredItems.avatar
      ) as INotifyAPAvatarItem;
      const hasName =
        apAvatar?.label ?? (u.profile?.name || u.profile?.surname);
      return {
        name: hasName
          ? `${u.profile?.name} ${u.profile?.surname}`
          : u.email || 'Ignoto',
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
