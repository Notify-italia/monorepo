import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  EnumNotifyAPDirections,
  NOTIFY_AP_DIRECTIONS_IT,
} from '@notify/interfaces';
import { UtilsService } from '../../../../services';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';
import { AdvancedProfileItemsService } from '../../services/advanced-profile-items.service';

@Component({
  selector: 'notify-background-gradient-form',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule, DragDropModule],
  providers: [UtilsService, AdvancedProfileItemsService],
  template: `
    <div class="flex flex-col space-y-4">
      <notify-tailwind-select
        [parent]="gradientForm.fg"
        [options]="gradientDirections"
        name="direction"
        label="Direzione"
        [compact]="true"
      ></notify-tailwind-select>

      <div class="flex flex-col">
        <button class="btn btn-sm w-full" (click)="addGradientItem()">
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
        <small
          class="text-center text-xs mt-2 opacity-75"
          *ngIf="gradientForm.colorsFa.value.length"
        >
          Fai click per scegliere un colore o trascina per riordinare
        </small>
      </div>
      <div
        class="flex flex-col space-y-4 "
        cdkDropList
        (cdkDropListDropped)="updateGradientDropList($event)"
      >
        @for (item of gradientForm.colorsFa.controls; track $index) {
        <div class="flex space-x-2 items-center px-2 cdkDrag" cdkDrag>
          <notify-tailwind-color-picker
            [parent]="item"
            name="value"
            class="w-full"
            [compact]="true"
          ></notify-tailwind-color-picker>
          <button
            class="btn btn-sm btn-error btn-outline btn-square"
            (click)="removeGradientItem($index)"
            data-theme="notifytheme"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        }
      </div>
    </div>
  `,
})
export class AdvancedProfileBackgroundGradientFormComponent {
  private _utils = inject(UtilsService);
  private _apItems = inject(AdvancedProfileItemsService);

  @Input({ required: true }) pageSettingsForm!: FormGroup;

  public gradientDirections = this._apItems.createSelectOptions(
    EnumNotifyAPDirections,
    NOTIFY_AP_DIRECTIONS_IT
  );

  public get gradientForm() {
    const fg = this.pageSettingsForm.controls[
      'gradient'
    ] as unknown as FormGroup;
    const colorsFa = fg.controls['colors'] as unknown as FormArray<FormGroup>;

    return {
      fg,
      colorsFa,
    };
  }

  public addGradientItem() {
    const colorsFa = this.gradientForm.colorsFa as unknown as FormArray;
    colorsFa.push(
      new FormGroup({
        value: new FormControl(this._utils.randomColor()),
      })
    );
  }

  public updateGradientDropList(event: CdkDragDrop<string[]>) {
    const colorsFa = this.gradientForm.colorsFa as unknown as FormArray;
    const controlToMove = colorsFa.controls[event.previousIndex];

    colorsFa.removeAt(event.previousIndex);
    colorsFa.insert(event.currentIndex, controlToMove);
  }

  public removeGradientItem(index: number) {
    const colorsFa = this.gradientForm.colorsFa as unknown as FormArray;
    colorsFa.removeAt(index);
  }
}
