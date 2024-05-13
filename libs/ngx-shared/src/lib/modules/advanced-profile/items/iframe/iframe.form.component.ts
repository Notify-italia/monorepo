import { Component } from '@angular/core';

import { Validators } from '@angular/forms';
import { INotifyAPIframeItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseComponent,
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
} from '../../../../constructors/ap-item.form.base.component';

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: `
    <div class="flex flex-col space-y-1">
      <notify-tailwind-input
        [parent]="form"
        name="url"
        placeholder="notifyapp.it"
        label="Indirizzo Web"
        prefix="https://"
        [compact]="true"
        [validationErrors]="validationErrors"
      ></notify-tailwind-input>
      <small class="text-center"
        >Non tutti i siti web potrebbero essere visualizzati correttamente sul
        profilo.</small
      >
    </div>
  `,
})
export class IFrameFormComponent extends AdvancedItemFormBaseComponent<INotifyAPIframeItem> {
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
  }
}
