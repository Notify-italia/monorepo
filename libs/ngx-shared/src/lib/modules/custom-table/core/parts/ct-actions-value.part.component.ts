import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  CustomTableValueBaseComponent,
  INotifyCustomTableValueBase,
} from '../../../../constructors/custom-table-value.base.component';
import { UtilsService } from '../../../../services';
import { AvatarComponent } from '../../../../standalones';

export interface ICTActionsValue extends INotifyCustomTableValueBase {
  valueType: 'actions';
  actions: {
    eventName: string;
    path: string[];
    tooltip?: string;
    svgType: 'solid' | 'outlined';
    color:
      | 'primary'
      | 'secondary'
      | 'error'
      | 'warning'
      | 'success'
      | 'info'
      | 'neutral'
      | 'accent';
  }[];
}
@Component({
  standalone: true,
  selector: 'notify-custom-table-actions-value',
  imports: [CommonModule, AvatarComponent],
  providers: [UtilsService],
  template: `
    <div
      class="space-x-4 py-2 px-4 rounded-2xl flex justify-center w-fit"
      [ngClass]="
      {
        'bg-white/5': value.actions.length > 1,
      }"
      (click)="$event.stopPropagation()"
    >
      @for (action of value.actions; track $index) {
      <div
        [ngClass]="{
        'tooltip': action.tooltip?.length,
      }"
        [attr.data-tip]="action.tooltip"
      >
        <button
          class="action-btn {{ 'action-' + action.color }}"
          data-theme="notifytheme"
          (click)="actionClicked.emit(action)"
        >
          <svg
            *ngIf="action.svgType === 'outlined'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            @for (path of action.path; track $index) {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="path"
            />

            }
          </svg>

          <svg
            *ngIf="action.svgType === 'solid'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            @for (path of action.path; track $index) {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              [attr.d]="path"
            />

            }
          </svg>
        </button>
      </div>
      }
    </div>
  `,
})
export class CustomTableActionsComponent extends CustomTableValueBaseComponent {
  override value!: ICTActionsValue;

  @Output() actionClicked = new EventEmitter<ICTActionsValue['actions'][0]>();
}
