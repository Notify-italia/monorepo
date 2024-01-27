import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyUser } from '@notify/interfaces';
import { Observable, Subject, map } from 'rxjs';
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
  templateUrl: './note-add-owner.component.html',
  styleUrl: './note-add-owner.component.scss',
})
export class NoteAddOwnerComponent implements OnInit {
  @Input() users$ = new Observable<INotifyUser[]>();
  @Input() cf!: ComponentRef<NoteAddOwnerComponent>;
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

  @HostListener('document:keydown.escape', ['$event'])
  public close() {
    this.cf.destroy();
  }

  public mapUsers(u: INotifyUser[]) {
    return u.map((u) => {
      const hasName = u.profile?.name || u.profile?.surname;
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
