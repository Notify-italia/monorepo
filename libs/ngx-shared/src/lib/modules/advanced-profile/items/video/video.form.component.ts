import { Component } from '@angular/core';

import { INotifyAPVideoItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
  AdvancedProfileItemFormBaseComponent,
} from '../../../../constructors/ap-item.form.base.component';

const CHECKBOX_TOGGLE_MUTED = {
  checked: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
</svg>`,
  unchecked: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
  <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
</svg>
`,
};

const CHECKBOX_TOGGLE_AUTOPLAY = {
  checked: `<svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 -960 960 960" fill="#e8eaed" xmlns:v="https://vecta.io/nano"><path d="M380-300v-360l280 180-280 180ZM480-40q-108 0-202.5-49.5T120-228v108H40v-240h240v80h-98q51 75 129.5 117.5T480-120q115 0 208.5-66T820-361l78 18q-45 136-160 219.5T480-40ZM42-520q7-67 32-128.5T143-762l57 57q-32 41-52 87.5T123-520H42Zm214-241-57-57q53-44 114-69.5T440-918v80q-51 5-97 25t-87 52Zm449 0q-41-32-87.5-52T520-838v-80q67 6 128.5 31T762-818l-57 57Zm133 241q-5-51-25-97.5T761-705l57-57q44 52 69 113.5T918-520h-80Z"/></svg>`,
  unchecked: `<svg xmlns="http://www.w3.org/2000/svg" class="size-6 opacity-50" viewBox="0 -960 960 960" fill="#e8eaed" xmlns:v="https://vecta.io/nano"><path d="M380-300v-360l280 180-280 180ZM480-40q-108 0-202.5-49.5T120-228v108H40v-240h240v80h-98q51 75 129.5 117.5T480-120q115 0 208.5-66T820-361l78 18q-45 136-160 219.5T480-40ZM42-520q7-67 32-128.5T143-762l57 57q-32 41-52 87.5T123-520H42Zm214-241-57-57q53-44 114-69.5T440-918v80q-51 5-97 25t-87 52Zm449 0q-41-32-87.5-52T520-838v-80q67 6 128.5 31T762-818l-57 57Zm133 241q-5-51-25-97.5T761-705l57-57q44 52 69 113.5T918-520h-80Z"/></svg>
`,
};

const CHECKBOX_TOGGLE_LOOP = {
  checked: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-6" fill="#e8eaed" xmlns:v="https://vecta.io/nano"><path d="m360-120-57-56 64-64h-7q-117 0-198.5-81.5T80-520q0-117 81.5-198.5T360-800h240q117 0 198.5 81.5T880-520q0 117-81.5 198.5T600-240v-80q83 0 141.5-58.5T800-520q0-83-58.5-141.5T600-720H360q-83 0-141.5 58.5T160-520q0 83 58.5 142.5T360-312h16l-72-72 56-56 160 160-160 160Z"/></svg>`,
  unchecked: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="size-6 opacity-50" fill="#e8eaed" xmlns:v="https://vecta.io/nano"><path d="m360-120-57-56 64-64h-7q-117 0-198.5-81.5T80-520q0-117 81.5-198.5T360-800h240q117 0 198.5 81.5T880-520q0 117-81.5 198.5T600-240v-80q83 0 141.5-58.5T800-520q0-83-58.5-141.5T600-720H360q-83 0-141.5 58.5T160-520q0 83 58.5 142.5T360-312h16l-72-72 56-56 160 160-160 160Z"/></svg>`,
};

@Component({
  standalone: true,
  imports: AdvancedItemFormBaseImports,
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: ` <div class="flex flex-col space-y-4">
    <notify-tailwind-input
      [parent]="form"
      name="source"
      label="URL"
      placeholder="https://www.youtube.com/watch?v=Koj0TOqcqzo"
      [compact]="true"
      helpText="URL del video caricato su YouTube"
    ></notify-tailwind-input>

    <div class="flex justify-around items-center">
      <div class="tooltip tooltip-bottom" data-tip="Ripeti">
        <notify-tailwind-checkbox
          [parent]="form"
          name="loop"
          label=" "
          [overrideToggleIcon]="checkboxToggleLoop"
          [compact]="true"
        ></notify-tailwind-checkbox>
      </div>

      <div class="tooltip tooltip-bottom" data-tip="Autoplay">
        <notify-tailwind-checkbox
          [parent]="form"
          name="autoplay"
          label=" "
          [overrideToggleIcon]="checkboxToggleAutoplay"
          [compact]="true"
        ></notify-tailwind-checkbox>
      </div>

      <div class="tooltip tooltip-bottom" data-tip="Audio">
        <notify-tailwind-checkbox
          [parent]="form"
          [disabled]="form.controls.autoplay.value"
          name="muted"
          label=" "
          [overrideToggleIcon]="checkboxToggleMuted"
          [compact]="true"
        ></notify-tailwind-checkbox>
      </div>
    </div>

    <div class="divider ">
      <small>Player</small>
    </div>

    <notify-tailwind-slider
      [parent]="form"
      name="height"
      label="Altezza"
      [compact]="true"
      [steps]="0"
      [min]="180"
      [max]="640"
      [stepsLabels]="{
        startLabel:'Video',
        endLabel:'Short',
        showCurrentStep:false,
        showCurrentStepWhileDragging:false,
        
      }"
    ></notify-tailwind-slider>

    <notify-tailwind-checkbox
      [parent]="form"
      name="controls"
      label="Controlli"
      [compact]="true"
    ></notify-tailwind-checkbox>
  </div>`,
})
export class VideoFormComponent extends AdvancedProfileItemFormBaseComponent<INotifyAPVideoItem> {
  public checkboxToggleMuted = CHECKBOX_TOGGLE_MUTED;
  public checkboxToggleAutoplay = CHECKBOX_TOGGLE_AUTOPLAY;
  public checkboxToggleLoop = CHECKBOX_TOGGLE_LOOP;

  public override componentReady(): void {
    this.context.getters.formChanged.pipe().subscribe(() => {
      if (!this.form.controls.autoplay.value) {
        return;
      }

      this.form.controls.muted.setValue(true, { emitEvent: false });
    });
  }
}
