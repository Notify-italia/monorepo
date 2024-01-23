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
import { Observable, map } from 'rxjs';
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
    return u.map((u) => ({
      name: `${u.profile?.name} ${u.profile?.surname}`,
      value: u._id,
    }));
  }
}
