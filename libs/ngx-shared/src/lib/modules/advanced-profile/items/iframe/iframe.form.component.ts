import { Component } from '@angular/core';

import { Validators } from '@angular/forms';
import {
  EnumNotifyAPDirections,
  INotifyAPIFrameItem,
} from '@notify/interfaces';
import { tap } from 'rxjs';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: `
    <div class="flex flex-col space-y-4">
      <notify-tailwind-input
        [parent]="form"
        name="url"
        placeholder="notifyapp.it"
        label="Indirizzo Web"
        prefix="https://"
        [compact]="true"
        [validationErrors]="validationErrors"
      ></notify-tailwind-input>
      <div class="relative w-full">
        <notify-tailwind-checkbox
          [parent]="form"
          name="openInNotify"
          label="Apri in Notify"
          [compact]="true"
          class="w-full"
        ></notify-tailwind-checkbox>
        <small class="absolute top-6 opacity-50"
          >Non supportato da tutti i siti web.</small
        >
      </div>
      <div class="divider"></div>
      <notify-tailwind-select
        [parent]="form"
        name="direction"
        [compact]="true"
        label="Orientamento"
        [options]="context.components.select.directions"
      ></notify-tailwind-select>
      <notify-tailwind-select
        [parent]="form"
        name="imgFit"
        [compact]="true"
        label="Riempimento immagine"
        [options]="context.components.select.objectFit"
      ></notify-tailwind-select>
      <notify-tailwind-slider
        *ngIf="
          form.controls.direction.value === context.statics.directions.Vertical
        "
        [parent]="form"
        name="boxHeight"
        label="Altezza"
        [steps]="20"
        [min]="100"
        [max]="400"
        [compact]="true"
        [stepsLabels]="{
        showCurrentStepWhileDragging: false,
      }"
      ></notify-tailwind-slider>
    </div>
  `,
})
export class IFrameFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPIFrameItem> {
  validationErrors = {
    pattern: 'Inserisci un URL valido',
  };

  public override componentReady(): void {
    this.form.controls.url.addValidators([
      Validators.pattern(
        new RegExp(
          '^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$',
          'i'
        )
      ),
    ]);

    this.form.controls.direction.valueChanges
      .pipe(
        tap((v) => {
          if (v === EnumNotifyAPDirections.Vertical) {
            this.form.controls.boxHeight.setValue(288);
            return;
          }

          this.form.controls.boxHeight.setValue(128);
        })
      )
      .subscribe();
  }
}
