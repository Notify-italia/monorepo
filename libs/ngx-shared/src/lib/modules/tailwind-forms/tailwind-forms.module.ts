import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ColorPickerModule } from 'ngx-color-picker';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TailwindAdvancedSelectComponent } from './components/tailwind-advanced-select/tailwind-advanced-select.component';
import { TailwindCheckboxComponent } from './components/tailwind-checkbox/tailwind-checkbox.component';
import { TailwindColorPickerComponent } from './components/tailwind-color-picker/tailwind-color-picker.component';
import { TailwindDatepickerComponent } from './components/tailwind-datepicker/tailwind-datepicker.component';

import { RemoveFocusDirective } from '../../directives';
import { DropzoneModule } from '../../standalones/dropzone/public-api';
import { TailwindDropzoneComponent } from './components/tailwind-dropzone/tailwind-dropzone.component';
import { TailwindInputComponent } from './components/tailwind-input/tailwind-input.component';
import { TailwindRadioListDescriptionPanelComponent } from './components/tailwind-radio-list-description-panel/tailwind-radio-list-description-panel.component';
import { TailwindSelectMultipleComponent } from './components/tailwind-select-multiple/tailwind-select-multiple.component';
import { TailwindSelectComponent } from './components/tailwind-select/tailwind-select.component';
import { TailwindSubmitButtonComponent } from './components/tailwind-submit-button/tailwind-submit-button.component';
import { TailwindTextareaComponent } from './components/tailwind-textarea/tailwind-textarea.component';
import { TailwindTimepickerComponent } from './components/tailwind-timepicker/tailwind-timepicker.component';
import { TailwindToggleButtonComponent } from './components/tailwind-toggle-button/tailwind-toggle-button.component';
import { HighlightSearchPipe } from './pipes/highlight-search.pipe';
import { TailwindFormsService } from './services/tailwind-forms.service';

@NgModule({
  declarations: [
    TailwindInputComponent,
    TailwindSubmitButtonComponent,
    TailwindRadioListDescriptionPanelComponent,
    TailwindTimepickerComponent,
    TailwindDatepickerComponent,
    TailwindSelectComponent,
    TailwindCheckboxComponent,
    TailwindSelectMultipleComponent,
    TailwindToggleButtonComponent,
    HighlightSearchPipe,
    TailwindColorPickerComponent,
    TailwindAdvancedSelectComponent,
    TailwindDropzoneComponent,
    TailwindTextareaComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ColorPickerModule,
    RemoveFocusDirective,
    DropzoneModule,
  ],
  exports: [
    TailwindInputComponent,
    TailwindSubmitButtonComponent,
    TailwindRadioListDescriptionPanelComponent,
    TailwindTimepickerComponent,
    TailwindDatepickerComponent,
    TailwindSelectComponent,
    TailwindCheckboxComponent,
    TailwindSelectMultipleComponent,
    HighlightSearchPipe,
    TailwindColorPickerComponent,
    TailwindAdvancedSelectComponent,
    TailwindTextareaComponent,
    TailwindDropzoneComponent,
  ],
  providers: [TailwindFormsService, provideNgxMask()],
})
export class TailwindFormsModule {}

//directly exporting all exported components of the ngModule to include them automatically the lib's index.ts
export {
  HighlightSearchPipe,
  TailwindAdvancedSelectComponent,
  TailwindCheckboxComponent,
  TailwindColorPickerComponent,
  TailwindDatepickerComponent,
  TailwindDropzoneComponent,
  TailwindInputComponent,
  TailwindRadioListDescriptionPanelComponent,
  TailwindSelectComponent,
  TailwindSelectMultipleComponent,
  TailwindSubmitButtonComponent,
  TailwindTextareaComponent,
  TailwindTimepickerComponent,
};
