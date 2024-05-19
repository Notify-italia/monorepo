import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { FormGroup } from '@angular/forms';
import {
  EnumNotifyAPCorners,
  INotifyAPAvatarItem,
  NOTIFY_AP_OWNER_IMG_CORNER_IT,
  daisyUIAvatarMaks,
  daisyUIAvatarMaksIT,
} from '@notify/interfaces';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';
import { TAILWIND_DROPZONE_DEFAULT_LABELS } from '../../../tailwind-forms/components/tailwind-dropzone/tailwind-dropzone.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: `
    <div class="flex flex-col space-y-4">
      <notify-tailwind-select
        [parent]="form"
        name="direction"
        [compact]="true"
        label="Orientamento"
        [options]="directionSelectOptions"
        [ngClass]="{
          'pointer-events-none brightness-50': form.value.imgMask === 'banner'
        }"
      ></notify-tailwind-select>

      <notify-tailwind-select
        *ngIf="isAgent"
        [parent]="form"
        name="ownerImgCorner"
        [compact]="true"
        label="Posizione avatar aziendale"
        [options]="cornerSelectOptions"
        [ngClass]="{
          'pointer-events-none brightness-50': form.value.imgMask === 'banner'
        }"
      ></notify-tailwind-select>

      <div class="divider"></div>

      <notify-tailwind-dropzone
        [parent]="form"
        acceptedFiles="image/*"
        name="imgSrc"
        [maxFiles]="1"
        height="10rem"
        [labels]="dropzoneLabels"
        [cdnConfig]="context.controls.dropzone.config"
        [centerPreview]="true"
        [delegateActions]="{
          deleteFromForm: false,
          addToForm: false
        }"
        (itemDeleted)="deleteAvatar()"
        (itemAdded)="addAvatar($event)"
      ></notify-tailwind-dropzone>

      <notify-tailwind-select
        [parent]="form"
        name="imgMask"
        [compact]="true"
        label="Cornice"
        placeholder="Nessuna"
        [options]="avatarMaskOptions"
      ></notify-tailwind-select>

      <div class="divider"></div>

      <notify-tailwind-input
        [parent]="form"
        name="label"
        label="Testo principale"
        placeholder="Mario Rossi"
        [compact]="true"
      >
      </notify-tailwind-input>

      <div class="flex space-x-2 items-end w-full">
        <notify-tailwind-input
          [parent]="form"
          name="sublabel"
          [label]="form.value.useRoleSubLabel ? 'Ruolo' : 'Sottotitolo'"
          class="w-full"
          placeholder="Mario Rossi"
          [showClearInput]="!form.value.useRoleSubLabel"
          [compact]="true"
          [readOnly]="!!form.value.useRoleSubLabel"
        >
        </notify-tailwind-input>
        <div
          class="tooltip tooltip-left"
          [attr.data-tip]="
            useRoleLabel ? 'Scrivi un sottotitolo' : 'Usa ruolo aziendale'
          "
          *ngIf="isAgent"
        >
          <button
            class="btn btn-outline shrink-0 btn-square mb-[0.2rem]  btn-sm"
            (click)="toggleCompanyLabel()"
            [disabled]="!role.length"
          >
            @if(this.useRoleLabel) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
              />
            </svg>
            } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                clip-rule="evenodd"
              />
            </svg>

            }
          </button>
        </div>
      </div>

      <notify-tailwind-textarea
        [parent]="form"
        name="description"
        label="Descrizione"
        [allowResize]="{
          vertical: true
        }"
        [compact]="true"
        [cols]="5"
        placeholder="Nessuna Descrizione"
      ></notify-tailwind-textarea>
    </div>
  `,
})
export class AvatarFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPAvatarItem> {
  public avatarMaskOptions = [
    ...daisyUIAvatarMaks.map((item) => ({
      name: new TitleCasePipe().transform(daisyUIAvatarMaksIT[item]),
      value: item,
    })),
    { name: 'Banner', value: 'banner' },
  ];

  public dropzoneLabels = {
    ...TAILWIND_DROPZONE_DEFAULT_LABELS,
    defaultMessage: "Carica un'immagine da visualizzare come avatar",
  };

  public cornerSelectOptions = Object.values(EnumNotifyAPCorners).map((v) => ({
    name: NOTIFY_AP_OWNER_IMG_CORNER_IT[v],
    value: v,
  }));

  public get role() {
    return this.profile.role || '';
  }

  public get useRoleLabel() {
    return this.form.get('useRoleSubLabel')?.value;
  }

  public toggleCompanyLabel() {
    const useRoleSubLabel = this.form.get('useRoleSubLabel');
    useRoleSubLabel?.setValue(!useRoleSubLabel.value);

    if (useRoleSubLabel?.value) {
      this.form.get('sublabel')?.setValue(this.role);
      return;
    }

    this.form.get('sublabel')?.setValue('');
  }

  public deleteAvatar() {
    const fg = this.form.controls.imgSrc;

    fg.removeAt(0);
  }

  public addAvatar(items: Record<string, unknown>[]) {
    const item = items[0] as unknown as {
      name: string;
      size: number;
      type: string;
      data: string;
      url: string;
    };
    const control = this.form.controls.imgSrc.controls[0];

    if (!control) {
      this.form.controls.imgSrc.push(
        this.context.services.forms.createFormGroup({
          name: item.name,
          size: item.size,
          type: item.type,
          url: item.url,
          data: item.data,
        }) as FormGroup
      );
      return;
    }

    this.form.controls.imgSrc.controls[0].setValue(item);
  }
}
