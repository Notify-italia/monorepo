import { CommonModule, TitleCasePipe } from '@angular/common';
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
  DaisyUIAvatarMasks,
  EnumNotifyUserType,
  INotifyProfile,
  daisyUIAvatarMaks,
  daisyUIAvatarMaksIT,
  defaultAvatarMask,
} from '@notify/interfaces';
import {
  CapacitorService,
  UtilsService,
  itPhoneNumberValidators,
} from '@notify/nfc-app-services';
import { Subject, takeUntil, tap } from 'rxjs';
import { TailwindFormsModule } from '../../modules/tailwind-forms/tailwind-forms.module';
import { IconSelectorComponent } from '../icon-select/icon-selector.component';
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
  avatarMask: FormControl<DaisyUIAvatarMasks | null>;
  street: FormControl<string | null>;
  city: FormControl<string | null>;
  number: FormControl<string | null>;
  reviewRedirect: FormControl<string | null>;
  smsEnabled: FormControl<boolean | null>;
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
  @Input({ required: true }) public profile!: INotifyProfile;
  @Input() public loading = false;

  @Output() public value = new EventEmitter<INotifyProfile>();
  @Output() public submitForm = new EventEmitter<void>();
  @Output() public reloadForm = new EventEmitter<void>();

  public removeAvatar$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  public isMacos = navigator.userAgent.toLowerCase().includes('mac os');
  public desktopMessage = `Fai click per caricare un'immagine o trascinala all'interno del riquadro`;
  public mobileMessage = `Tocca per caricare un'immagine`;
  public enumNotifyUserType = EnumNotifyUserType;

  public form: ProfileForm = new FormGroup({}) as unknown as ProfileForm;
  public avatarFile = new File([], '');
  public avatarMaskOptions = daisyUIAvatarMaks.map((item) => ({
    name: new TitleCasePipe().transform(daisyUIAvatarMaksIT[item]),
    value: item,
  }));

  public validationErrors = {
    required: ' ',
    email: 'Email non valida',
    pattern: 'Valore non valido',
    itPhoneNumber: 'Numero di telefono non valido',
  };

  public get isAgent() {
    return this.profile.type === EnumNotifyUserType.Agent;
  }

  public get isCompany() {
    return this.profile.type === EnumNotifyUserType.Company;
  }

  constructor(
    private _utils: UtilsService,
    public capacitor: CapacitorService
  ) {}

  public ngOnInit(): void {
    this.form = this._buildForm();

    //emette il valore del form ad ogni cambiamento
    this.form.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        tap((value) => this.value.emit(this._mapFormToProfile(value)))
      )
      .subscribe();
  }

  public setUploadedFile(file: string | ArrayBuffer | null) {
    this.form.controls.avatar.setValue(file as string);
  }

  public removeCustomField(item: FormGroup) {
    const index = this.form.controls.customFields.value.indexOf(item.value);

    this.form.controls.customFields.removeAt(index);
  }

  public resetForm() {
    this.reloadForm.emit();
  }

  private _buildForm(): ProfileForm {
    const _requiredWhenAgent = this.isAgent ? [Validators.required] : [];

    const f = new FormGroup({
      avatar: new FormControl(this.profile.avatar || '', []),
      name: new FormControl(this.profile.name || '', [Validators.required]),
      surname: new FormControl(this.profile?.surname || '', _requiredWhenAgent),
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
      avatarMask: new FormControl<DaisyUIAvatarMasks>(
        this.profile.config.avatarMask || defaultAvatarMask(this.profile.type),
        []
      ),
      reviewRedirect: new FormControl(this.profile.reviewRedirect || '', []),
      street: new FormControl(this.profile.address?.street || ''),
      city: new FormControl(this.profile.address?.city || ''),
      number: new FormControl(this.profile.address?.number || ''),
      smsEnabled: new FormControl(this.profile.config.smsEnabled ?? true, []),
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
        value: new FormControl(data?.value || '', [Validators.required]),
      })
    );
  }

  private _mapFormToProfile(form: ProfileForm['value']): INotifyProfile {
    const address = this.isAgent
      ? null
      : {
          street: form.street || null,
          city: form.city || null,
          number: form.number || null,
        };

    return {
      ...this.profile,
      name: form.name || null,
      surname: form.surname || null,
      email: form.email || null,
      phoneNumber: form.phoneNumber || null,
      bio: form.bio || null,
      avatar: form.avatar || null,
      config: {
        avatarMask: form.avatarMask || defaultAvatarMask(this.profile.type),
        whatsappEnabled: !!form.whatsappEnabled,
        phoneCallEnabled: !!form.phoneCallEnabled,
        emailEnabled: !!form.emailEnabled,
        smsEnabled: !!form.smsEnabled,
      },
      address,
      reviewRedirect: form.reviewRedirect || null,
      customFields:
        form.customFields?.map((item) => {
          return {
            iconName: item.iconName,
            value: item.value,
          };
        }) || [],
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
