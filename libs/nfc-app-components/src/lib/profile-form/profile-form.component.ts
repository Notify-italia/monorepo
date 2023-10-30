import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
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
import { itPhoneNumberValidators } from '@notify/nfc-app-services';
import { INotifyProfile } from '@notify/nfc-interfaces';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, tap } from 'rxjs';
import { IconSelectorComponent } from '../icon-select/icon-selector.component';
import { TailwindFormsModule } from '../tailwind-forms/tailwind-forms.module';
import { UploadComponent } from '../upload/upload.component';

//TODO generare schema sul backend e usare quello
//TODO campi custom
type ProfileForm = FormGroup<{
  name: FormControl<INotifyProfile['name'] | null>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  linkedIn: FormControl<string | null>;
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
  @Output() public value = new EventEmitter<ProfileForm['value']>();

  public removeAvatar$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  public isMacos = navigator.userAgent.toLowerCase().includes('mac os');

  public form: ProfileForm;
  private _formInitialValue: ProfileForm['value'];

  public validationErrors = {
    required: ' ',
    email: 'Email non valida',
    pattern: 'Valore non valido',
    itPhoneNumber: 'Numero di telefono non valido',
  };

  constructor(private _toastr: ToastrService) {
    this.form = this._buildForm();
    this._formInitialValue = this.form.value;
  }

  public ngOnInit(): void {
    //emette il valore del form ad ogni cambiamento
    this.form.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((value) => {
          this.value.emit(value);
        })
      )
      .subscribe();
  }

  public setUploadedFile(file: string | ArrayBuffer | null) {
    this.form.controls.avatar.setValue(file as string);
  }

  public addCustomField() {
    this.form.controls.customFields.push(
      new FormGroup({
        iconName: new FormControl('', [Validators.required]),
        //url validator
        value: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[^\s/$.?#]+\.[^\s]*$/
          ),
        ]),
      })
    );
  }

  public removeCustomField(item: FormGroup) {
    const index = this.form.controls.customFields.value.indexOf(item);
    this.form.controls.customFields.removeAt(index);
  }

  public resetForm() {
    this.form.controls.customFields = this._buildForm().controls.customFields;
    this.form.reset(this._formInitialValue);
    this.removeAvatar$.next();
  }

  private _buildForm(): ProfileForm {
    return new FormGroup({
      avatar: new FormControl('', []),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [itPhoneNumberValidators]),
      linkedIn: new FormControl('', [
        Validators.pattern(
          /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}\/?$/
        ),
      ]),
      bio: new FormControl('', []),
      whatsappEnabled: new FormControl(true, []),
      phoneCallEnabled: new FormControl(true, []),
      emailEnabled: new FormControl(true, []),
      customFields: new FormArray([] as FormGroup[]),
    });
  }

  //TODO testare su windows
  @HostListener('window:keydown.ctrl.shift.s', ['$event'])
  @HostListener('window:keydown.Control.shift.s', ['$event'])
  public submit(e?: KeyboardEvent) {
    e?.preventDefault();
    this._toastr.success('Profilo aggiornato');
  }
}
