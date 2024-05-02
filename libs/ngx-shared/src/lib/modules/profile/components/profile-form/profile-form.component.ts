import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  INotifyUser,
  NotifyPopulatedNote,
  daisyUIAvatarMaks,
  daisyUIAvatarMaksIT,
} from '@notify/interfaces';

import { RouterModule } from '@angular/router';
import {
  Subject,
  combineLatest,
  debounceTime,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import { TailwindFormsModule } from '../../../../modules/tailwind-forms/tailwind-forms.module';
import { CapacitorService, UtilsService } from '../../../../services';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { ImageCropperFactory } from '../../../../standalones/image-cropper/image-cropper.factory';
import { UploadComponent } from '../../../../standalones/upload/upload.component';
import { itPhoneNumberValidators } from '../../../../validators';
import { ITailwindSelectOption } from '../../../tailwind-forms/components/tailwind-select/tailwind-select.component';
import { AddButtonComponent } from './add-button.component';
import { RemoveItemButtonComponent } from './remove-item-button';
import { OpenItemButtonComponent } from './test-item-button';

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
  piva: FormControl<string | null>;
  number: FormControl<string | null>;
  reviewRedirect: FormControl<string | null>;
  smsEnabled: FormControl<boolean | null>;
  backgroundColors: FormArray<FormGroup>;
  elementsColor: FormControl<string | null>;
  useCompanyColors: FormControl<boolean | null>;
  redirectEnabled: FormControl<boolean | null>;
  redirectUrl: FormControl<string | null>;
  note: FormControl<string | null>;
  noteShowTitle: FormControl<boolean | null>;
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
    AddButtonComponent,
    RemoveItemButtonComponent,
    OpenItemButtonComponent,
    RouterModule,
  ],
  providers: [ImageCropperFactory],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input({ required: true }) public profile!: INotifyProfile;
  @Input() public loading = false;
  @Input() public savedRedirects: INotifyUser['savedRedirects'] = [];
  @Input() public notes: ITailwindSelectOption[] = [];

  @Output() public value = new EventEmitter<INotifyProfile>();
  @Output() public submitForm = new EventEmitter<INotifyProfile>();
  @Output() public removeSavedRedirect = new EventEmitter<string>();

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
    pattern: ' ',
    itPhoneNumber: 'Numero di telefono non valido',
  };

  public get isAgent() {
    return this.profile.type === EnumNotifyUserType.Agent;
  }

  public get isCompany() {
    return this.profile.type === EnumNotifyUserType.Company;
  }

  public get controls() {
    return this.form.controls;
  }

  private set _avatarFileFromUrl(value: string) {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    if (!value) {
      this.avatarFile = new File([], '');
      return;
    }

    if (base64regex.test(value)) {
      this.avatarFile = new File(this._utils.stringToArrayBuffer(value), '', {
        type: 'image/png',
      });
      return;
    }

    fetch(value).then((res) => {
      res.blob().then((blob) => {
        this.avatarFile = new File([blob], 'avatar.png', {
          type: 'image/png',
        });
      });
    });
  }

  constructor(
    private _utils: UtilsService,
    public capacitor: CapacitorService,
    private _imageCropper: ImageCropperFactory
  ) {}

  public ngOnInit(): void {
    this.form = this._buildForm();

    //emette il valore del form ad ogni cambiamento
    combineLatest([this.form.valueChanges, this.form.statusChanges])
      .pipe(
        takeUntil(this._destroy$),
        map(([value]) => {
          const mappedProfile = this._mapFormToProfile(value);
          return { ...value, mappedProfile };
        }),
        tap((v) => this.value.emit(v.mappedProfile)),
        debounceTime(500),
        tap((v) => {
          if (this.form.invalid) {
            return;
          }
          this.submitForm.emit(v.mappedProfile);
        })
      )
      .subscribe();
  }

  private _buildForm(): ProfileForm {
    const pColors = this.profile?.colors;

    const f = new FormGroup<ProfileForm['controls']>({
      avatar: new FormControl(this.profile.avatar || '', []),
      name: new FormControl(this.profile.name || ''),
      surname: new FormControl(this.profile?.surname || ''),
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
        this.profile.config.avatarMask || '',
        []
      ),
      reviewRedirect: new FormControl(this.profile.reviewRedirect || '', []),
      street: new FormControl(this.profile.address?.street || ''),
      city: new FormControl(this.profile.address?.city || ''),
      number: new FormControl(this.profile.address?.number || ''),
      smsEnabled: new FormControl(this.profile.config.smsEnabled ?? true, []),
      backgroundColors: new FormArray([] as FormGroup[]),
      piva: new FormControl(this.profile.piva || '', []),
      elementsColor: new FormControl(pColors?.elements || '#ffffff'),
      useCompanyColors: new FormControl(pColors?.useCompanyColors || false, []),
      redirectEnabled: new FormControl(
        this.profile.config.redirectEnabled ?? false,
        []
      ),
      note: new FormControl(this.profile.note?._id || '', []),
      noteShowTitle: new FormControl(
        this.profile.noteOptions?.showTitle ?? true
      ),
      redirectUrl: new FormControl(this.profile.redirectUrl || '', [
        Validators.pattern(/^([a-z0-9]+:+(\/\/)?)?[\w-]+(\.[\w-]+)+[#?]?.*$/i),
      ]),
    });

    this.profile.customFields?.forEach((item) => {
      this.addCustomField(item, f.controls.customFields as FormArray);
    });

    this.addColor(
      f.controls.backgroundColors as FormArray,
      pColors?.background?.[0] || '#0A2859'
    );
    this.addColor(
      f.controls.backgroundColors as FormArray,
      pColors?.background?.[1] || '#041127'
    );

    this._avatarFileFromUrl = f.controls.avatar.value || '';

    return f;
  }

  public addCustomField(
    data?: INotifyProfile['customFields'][0],
    fa?: FormArray
  ) {
    (fa || this.controls.customFields).push(
      new FormGroup({
        iconName: new FormControl(data?.iconName || '', [Validators.required]),
        //url validator
        value: new FormControl(data?.value || '', [Validators.required]),
      })
    );
  }

  public addColor(
    fa?: FormArray,
    data?: INotifyProfile['colors']['background'][0]
  ) {
    (fa || this.controls.backgroundColors).push(
      new FormGroup({
        value: new FormControl(data || '#ffffff', [Validators.required]),
      })
    );
  }

  public setUploadedFile(file: File | null) {
    if (!file) {
      this.controls.avatar.setValue(file);
      return;
    }

    const ref = this._imageCropper.create({
      imageData: file,
      minHeight: 200,
      minWidth: 200,
      roundCropper: true,
      containWithinAspectRatio: true,
      resize: {
        width: 800,
        height: 800,
      },
    });

    ref.instance.destroyed$
      .pipe(
        tap(
          () =>
            (this._avatarFileFromUrl = this.form.controls.avatar.value || '')
        )
      )
      .subscribe();

    ref.instance.submitted
      .pipe(
        takeUntil(ref.instance.destroyed$),
        tap((imageData) => {
          this.controls.avatar.setValue(imageData || '');

          this.setAvatarFromBase64(imageData);
        })
      )
      .subscribe();
  }

  public removeCustomField(item: FormGroup) {
    const index = this.controls.customFields.value.indexOf(item.value);

    this.controls.customFields.removeAt(index);
  }

  public removeNote() {
    this.controls.note.setValue('');
  }

  public removeColor(item: FormGroup) {
    const index = this.controls.backgroundColors.value.indexOf(item.value);

    this.controls.backgroundColors.removeAt(index);
  }

  public getUrl(protocol = 'https://', url: string) {
    return this._utils.populateWebProtocol(protocol, url);
  }

  public setAvatarFromBase64(data: string) {
    this.avatarFile = new File(this._utils.stringToArrayBuffer(data), '', {
      type: 'image/png',
    });
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
      name: form.name?.trim() || null,
      surname: form.surname?.trim() || null,
      email: form.email?.trim() || null,
      phoneNumber: form.phoneNumber?.trim() || null,
      bio: form.bio || null,
      avatar: form.avatar || null,
      piva: form.piva || null,
      config: {
        avatarMask: form.avatarMask || '',
        whatsappEnabled: !!form.whatsappEnabled,
        phoneCallEnabled: !!form.phoneCallEnabled,
        emailEnabled: !!form.emailEnabled,
        smsEnabled: !!form.smsEnabled,
        redirectEnabled: !!form.redirectEnabled,
        feedbackEnabled: this.profile.config.feedbackEnabled,
      },
      address,
      note: (form.note as unknown as NotifyPopulatedNote) || null,
      noteOptions: {
        showTitle: !!form.noteShowTitle,
      },
      reviewRedirect: form.reviewRedirect || null,
      customFields:
        form.customFields?.map((item) => {
          return {
            iconName: item.iconName,
            value: item.value,
          };
        }) || [],
      redirectUrl: form.redirectUrl || null,
      colors: {
        background: form.backgroundColors?.map((item) => item.value) || [],
        elements: form.elementsColor || '#ffffff',
        useCompanyColors: !!form.useCompanyColors,
      },
    };
  }
}
