import { Component } from '@angular/core';

import { INotifyAPDocumentItem } from '@notify/interfaces';
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
  template: ` <div class="flex flex-col space-y-4 smooth">
    <notify-upload
      [file]="context.components.upload.fileData"
      acceptedFiles="application/pdf"
      uploadLabel="Trascina un documento o clicca per caricarla"
      class="h-48"
      (fileChanged)="handleFileChanged($event)"
    ></notify-upload>

    <notify-tailwind-checkbox
      [parent]="form"
      [compact]="true"
      name="showInline"
      label="Mostra la preview del documento"
    ></notify-tailwind-checkbox>

    <div class="divider"></div>

    @if(form.value.showInline) {
    <notify-tailwind-checkbox
      [parent]="form"
      [compact]="true"
      name="showFilename"
      label="Mostra il nome del file"
    ></notify-tailwind-checkbox>
    <notify-tailwind-slider
      *ngIf="form.value.showInline"
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

    } @else {
    <notify-tailwind-input
      [parent]="$any(form.controls.button)"
      name="caption"
      label="Titolo pulsante"
      class="w-full"
      placeholder="Il mio documento"
      [showClearInput]="true"
      [compact]="true"
    >
    </notify-tailwind-input>
    }
  </div>`,
})
export class DocumentFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPDocumentItem> {
  public override async componentReady() {
    this.context.components.upload.init('docSrc');
  }

  public handleFileChanged(file: {
    file: File | null;
    blob: string | ArrayBuffer | null;
  }): void {
    this.context.components.upload.setControlValue(file, 'docSrc');
    this.form.controls.button
      .get('caption')
      ?.setValue(file.file?.name || 'Il mio documento');
  }
}
