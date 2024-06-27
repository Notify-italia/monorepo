import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { INotifyPopulatedLead } from '@notify/interfaces';
import { UtilsService, controlsFromObject } from '../../../../services';
import { TailwindFormsModule } from '../../../tailwind-forms/tailwind-forms.module';

@Component({
  selector: 'notify-lead-phonenumbers',
  standalone: true,
  imports: [CommonModule, TailwindFormsModule],
  providers: [UtilsService],
  styleUrl: '../../lead-detail/lead-detail.component.scss',
  template: `
    <div class="box p-4 space-y-2" *ngIf="form.controls.phoneNumbers as pns">
      <div class="row justify-between !items-center">
        <h2 class="section-title">Numeri di telefono</h2>
        <div
          class="tooltip tooltip-accent tooltip-left"
          data-tip="Aggiungi numero di telefono"
        >
          <button
            (click)="addPhoneNumber()"
            class="btn btn-primary btn-sm btn-circle mt-1"
            data-theme="notifytheme"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="column !space-y-2">
        @if(!pns.controls.length) {
        <div class="text-sm text-gray-400">Ancora nessun numero</div>
        } @for (item of pns.controls; track $index) {

        <div class="row">
          <notify-tailwind-input
            [compact]="true"
            [parent]="item"
            label=" "
            [showClearInput]="false"
            [name]="$index.toString()"
            placeholder="000 000 0000"
            [mask]="
              item.value[$any($index.toString())].startsWith('0')
                ? '0000 000 009'
                : '000 000 0000'
            "
          ></notify-tailwind-input>
          <button
            class="form-button smooth"
            (click)="pns.removeAt($index)"
            tabindex="-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
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
export class LeadPhoneNumbersFormComponent {
  @Input({ required: true }) form!: FormGroup<
    controlsFromObject<INotifyPopulatedLead>
  >;

  public addPhoneNumber() {
    this.form?.controls.phoneNumbers.push(
      new FormGroup({
        [this.form.controls.phoneNumbers.controls.length]: new FormControl(''),
      } as any)
    );
  }
}
