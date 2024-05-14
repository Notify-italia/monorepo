import { Component, QueryList, ViewChildren, inject } from '@angular/core';

import { INotifyAPLinksItem } from '@notify/interfaces';
import {
  AdvancedItemFormBaseComponent,
  AdvancedItemFormBaseImports,
  AdvancedItemFormBaseProviders,
} from '../../../../constructors/ap-item.form.base.component';
import { SvgboxService } from '../../../../services';
import { IconSelectorComponent } from '../../../../standalones/icon-select/icon-selector.component';
import { TailwindInputComponent } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  standalone: true,
  imports: [...AdvancedItemFormBaseImports, IconSelectorComponent],
  providers: AdvancedItemFormBaseProviders,
  styleUrls: ['../../advanced-profile.styles.scss'],
  template: ` <div class="flex flex-col space-y-4 items-center">
    <notify-tailwind-select
      [parent]="form"
      name="style"
      label="Stile Pulsanti"
      [options]="buttonStylesSelectOptions"
      class="w-full"
      [compact]="true"
    ></notify-tailwind-select>
    <notify-tailwind-select
      [parent]="form"
      name="direction"
      label="Orientamento"
      [options]="directionSelectOptions"
      class="w-full"
      [compact]="true"
    ></notify-tailwind-select>

    <div class="divider"></div>

    <button class="btn btn-sm w-full" (click)="addItem()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-6 h-6"
      >
        <path
          fill-rule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clip-rule="evenodd"
        />
      </svg>

      <span>Aggiungi</span>
    </button>

    @for (item of itemsForm.controls; track $index) {
    <div class="flex space-x-2 w-full items-center p-2 rounded-xl">
      <notify-icon-selector
        class="items-end "
        [icon]="item.controls.icon.value"
        (iconValue)="item.controls.icon.setValue($event?.name || '')"
        [openSelectorOnBoot]="false"
        #IconSelector
      ></notify-icon-selector>
      <div class="divider divider-horizontal"></div>
      <div class="flex flex-col space-y-2 w-full">
        <notify-tailwind-input
          [compact]="true"
          [parent]="item"
          [showClearInput]="false"
          name="caption"
          #Caption
          placeholder="Inserisci un titolo"
          label=" "
        ></notify-tailwind-input>

        <notify-tailwind-input
          [compact]="true"
          [parent]="item"
          name="url"
          label=" "
          [showClearInput]="false"
          [prefix]="IconSelector?.currentIcon?.publicPrefix || ''"
          [placeholder]="
            IconSelector?.currentIcon?.placeholder || 'Inserisci un link'
          "
        ></notify-tailwind-input>
        <div class="flex items-center space-x-2">
          <notify-tailwind-checkbox
            [parent]="item"
            name="visible"
            [compact]="true"
            [disabled]="isRequired"
            label=" "
            [overrideToggleIcon]="context.controls.checkbox.outlineToggleEye"
          ></notify-tailwind-checkbox>
          <a
            class="btn w-full btn-outline btn-sm shrink"
            [ngClass]="{
          'pointer-events-none opacity-50': !item.value.url?.length,
        }"
            [href]="currentUrl(item.value.icon || '', item.value.url || '')"
            target="_blank"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              ></path>
              <path d="M15 3h6v6"></path>
              <path d="M10 14 21 3"></path>
            </svg>
            <span>Prova</span>
          </a>
          <div class="tooltip tooltip-left tooltip-error" data-tip="Elimina">
            <button
              class="btn btn-outline btn-sm btn-error"
              data-theme="notifytheme"
              (click)="removeItem($index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-4 h-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    }
  </div>`,
})
export class LinksFormComponent extends AdvancedItemFormBaseComponent<INotifyAPLinksItem> {
  @ViewChildren('Caption')
  captions!: QueryList<TailwindInputComponent>;
  private _svgBoxSerivce = inject(SvgboxService);

  public get itemsForm() {
    return this.form.controls.items;
  }

  public addItem() {
    const link = this.context.services.forms.createFormGroup<
      INotifyAPLinksItem['items'][0]
    >(this.manifest.definitions.items[0]);

    this.itemsForm.push(link);

    setTimeout(() => {
      this.captions.last.inputRef.nativeElement.focus();
    }, 10);
  }

  public removeItem(index: number) {
    this.itemsForm.removeAt(index);
  }

  public currentUrl(item: string, url: string) {
    if (!item) {
      return '';
    }

    const icon = this._svgBoxSerivce.getIcon(item);

    return this.context.services.utils.populateWebProtocol(
      `${icon?.prefix || 'https://'}`,
      url
    );
  }
}
