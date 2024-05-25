import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotifyProfile } from '@notify/interfaces';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { ProfileService, UtilsService } from '../../../../services';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-personalize-link-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TailwindFormsModule],
  styles: `//center a div
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  `,
  template: ` <div
      class="w-full flex flex-col justify-center items-center space-y-4 relative"
    >
      <notify-tailwind-input
        [prefix]="displayFriendlyUrl"
        name="profileIdentifier"
        [placeholder]="profile._id"
        label="URL profilo"
        [showClearInput]="false"
        [compact]="true"
        [parent]="form"
        [validationErrors]="validationErrors"
        class="w-full"
      ></notify-tailwind-input>
      <div class="absolute right-3 top-3">
        <ng-container *ngIf="!valid" [ngTemplateOutlet]="None"></ng-container>
        <ng-container
          *ngIf="valid === 'error'"
          [ngTemplateOutlet]="Error"
        ></ng-container>
        <ng-container
          *ngIf="valid === 'pending'"
          [ngTemplateOutlet]="Pending"
        ></ng-container>
        <ng-container
          *ngIf="valid === 'success'"
          [ngTemplateOutlet]="Success"
        ></ng-container>
      </div>
    </div>

    <ng-template #Error>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        class="{{ iconClass }} text-red-500"
      >
        <path
          fill-rule="evenodd"
          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </ng-template>

    <ng-template #Pending>
      <div class="relative ">
        <div
          class="animate-spin inline-block {{
            iconClass
          }} border-[3px] border-current border-t-transparent text-yellow-500 rounded-full animate-slower"
          role="status"
          aria-label="loading"
        >
          <span class="sr-only">Loading...</span>
        </div>
        <!-- <div class="center absolute h-full w-full top-2 ">
          <div class="rounded-full p-4 h-1 w-1 bg-yellow-500"></div>
        </div>
        <div class="center absolute h-full w-full top-2 ">
          <div
            class="rounded-full p-1 h-1 w-1 bg-yellow-500  animate-ping"
          ></div>
        </div> -->
      </div>
    </ng-template>

    <ng-template #Success>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        class="{{ iconClass }} text-green-500"
      >
        <path
          fill-rule="evenodd"
          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
          clip-rule="evenodd"
        />
      </svg>
    </ng-template>

    <ng-template #None>
      <div class="{{ iconClass }}"></div>
    </ng-template>`,
})
export class PersonalizeLinkFormComponent implements OnInit {
  private _profileService = inject(ProfileService);
  private _utilsService = inject(UtilsService);

  @Input({ required: true }) profile!: INotifyProfile;
  @Input({ required: true }) baseUrl!: string;
  @Input({ required: true }) pageSettingsForm!: FormGroup;

  public valid: 'success' | 'error' | 'pending' | '' = '';
  public iconClass = 'w-6 h-6';

  public validationErrors = {
    minLength: 'almeno 2 caratteri',
  };

  public form!: FormGroup;

  private _newProfileIdentifier = '';

  public get confirmedProfileIdentifier() {
    return this._newProfileIdentifier || this.profile.profileIdentifier;
  }

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
            this.trimmedProfileIdentifier === this.confirmedProfileIdentifier
          ) {
            this.valid = '';
            return;
          }
          this.valid = 'pending';
        }),
        debounceTime(500),
        switchMap(() => {
          if (!this.valid) {
            return of();
          }

          return this._profileService.checkProfileIdentifier(
            this.form.value.profileIdentifier
          );
        }),
        tap((v: { available: boolean }) => {
          if (!v.available) {
            this.valid = 'error';
            return;
          }

          this.valid = 'success';
        }),
        switchMap(() => {
          if (!this.valid) {
            return of();
          }

          return this._profileService.patchProfile(
            {
              profileIdentifier: this.trimmedProfileIdentifier,
            },
            this.profile._id
          );
        }),
        tap(() => (this._newProfileIdentifier = this.trimmedProfileIdentifier)),
        catchError((err) => this._utilsService.errorHandler(err))
      )
      .subscribe();
  }
}
