import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  UtilsService,
  itPhoneNumberValidators,
} from '@notify/nfc-app-services';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { Subject, takeUntil, tap } from 'rxjs';
import { IconSelectorComponent } from '../icon-select/icon-selector.component';
import { TailwindFormsModule } from '../tailwind-forms/tailwind-forms.module';
import { UploadComponent } from '../upload/upload.component';

type ProfileForm = FormGroup<{
  name: FormControl<INotifyProfile['name']>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  bio: FormControl<string | null>;
  avatar: FormControl<string | null>;
  whatsappEnabled: FormControl<boolean | null>;
  phoneCallEnabled: FormControl<boolean | null>;
  emailEnabled: FormControl<boolean | null>;
  customFields: FormArray<FormGroup>;
}>;

@Component({
  selector: 'notify-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    TailwindFormsModule,
    ReactiveFormsModule,
    UploadComponent,
    IconSelectorComponent,
  ],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() public profile!: INotifyProfile;
  @Output() public value = new EventEmitter<INotifyProfile>();

  @Output() public submitForm = new EventEmitter<void>();
  @Output() public reloadForm = new EventEmitter<void>();

  public removeAvatar$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  public isMacos = navigator.userAgent.toLowerCase().includes('mac os');

  public form: ProfileForm = new FormGroup({}) as unknown as ProfileForm;

  public avatarFile = new File([], '');

  public validationErrors = {
    required: ' ',
    email: 'Email non valida',
    pattern: 'Valore non valido',
    itPhoneNumber: 'Numero di telefono non valido',
  };

  constructor(private _utils: UtilsService) {}

  public ngOnInit(): void {
    this.form = this._buildForm();

    //emette il valore del form ad ogni cambiamento
    this.form.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((value) => {
          this.value.emit(this._mapFormToProfile(value));
        })
      )
      .subscribe();
  }

  public setUploadedFile(file: string | ArrayBuffer | null) {
    this.form.controls.avatar.setValue(file as string);
  }

  public removeCustomField(item: FormGroup) {
    const index = this.form.controls.customFields.value.indexOf(item);
    this.form.controls.customFields.removeAt(index);
  }

  public resetForm() {
    this.reloadForm.emit();
  }

  private _buildForm(): ProfileForm {
    const f = new FormGroup({
      avatar: new FormControl(this.profile.avatar || '', []),
      name: new FormControl(this.profile.name || '', [Validators.required]),
      surname: new FormControl(this.profile?.surname || '', [
        Validators.required,
      ]),
      email: new FormControl(this.profile.email || '', [Validators.email]),
      phoneNumber: new FormControl(this.profile.phoneNumber || '', [
        itPhoneNumberValidators,
      ]),
      bio: new FormControl(this.profile.bio || '', []),
      whatsappEnabled: new FormControl(
        this.profile.config.whatsappEnabled ?? true,
        []
      ),
      phoneCallEnabled: new FormControl(
        this.profile.config.phoneCallEnabled ?? true,
        []
      ),
      emailEnabled: new FormControl(
        this.profile.config.emailEnabled ?? true,
        []
      ),
      customFields: new FormArray([] as FormGroup[]),
    });

    this.profile.customFields?.forEach((item) => {
      this.addCustomField(item, f.controls.customFields as FormArray);
    });

    if (f.controls.avatar.value) {
      this.avatarFile = new File(
        this._utils.stringToArrayBuffer(f.controls.avatar.value),
        '',
        {
          type: 'image/png',
        }
      );
    }

    return f;
  }

  public addCustomField(
    data?: INotifyProfile['customFields'][0],
    fa?: FormArray
  ) {
    (fa || this.form.controls.customFields).push(
      new FormGroup({
        iconName: new FormControl(data?.iconName || '', [Validators.required]),
        //url validator
        value: new FormControl(data?.value || '', [
          Validators.required,
          Validators.pattern(
            /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[^\s/$.?#]+\.[^\s]*$/
          ),
        ]),
      })
    );
  }

  private _mapFormToProfile(form: ProfileForm['value']): INotifyProfile {
    return {
      ...this.profile,
      name: form.name || null,
      surname: form.surname || null,
      email: form.email || null,
      phoneNumber: form.phoneNumber || null,
      bio: form.bio || null,
      avatar: form.avatar || null,
      config: {
        whatsappEnabled: !!form.whatsappEnabled,
        phoneCallEnabled: !!form.phoneCallEnabled,
        emailEnabled: !!form.emailEnabled,
      },
      customFields:
        form.customFields?.map((item) => ({
          iconName: item.iconName,
          value: item.value,
        })) || [],
    };
  }

  //TODO testare su windows
  @HostListener('window:keydown.ctrl.shift.s', ['$event'])
  @HostListener('window:keydown.Control.shift.s', ['$event'])
  public submit(e?: KeyboardEvent) {
    e?.preventDefault();

    if (this.form.invalid) {
      return;
    }

    this.submitForm.emit();
  }
}
