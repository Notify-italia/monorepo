import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UnknownType } from '@notify/interfaces';
import { ModalBaseComponent } from '../../../constructors';

export const SELECT_MODAL_TIMEOUT = 200;

export interface ISelectOption {
  value: UnknownType;
  label: string;
  style?: EnumSelectOptionStyle;
}

export enum EnumSelectOptionStyle {
  DESTRUCTIVE = 'destructive',
  PREFERRED = 'preferred',
  CANCEL = 'cancel',
}

@Component({
  selector: 'notify-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  animations: [
    trigger('modal', [
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.9)',
          ['box-shadow']: `0 30px 40px rgba(0,0,0,.1)`,
        })
      ),
      transition(
        'void => *',
        animate(
          '0.3s ease-out',
          keyframes([
            style({ opacity: 0, transform: 'scale(1.2)' }),
            style({ opacity: 1, transform: 'scale(1)' }),
          ])
        )
      ),
      transition(
        '* => void',
        animate(
          '0.2s ease-in-out',
          keyframes([
            style({ opacity: 1, transform: 'scale(1)' }),
            style({
              opacity: 0,
              transform: 'scale(0.9)',
              ['backdrop-filter']: 'blur(0px) brightness(1)',
            }),
          ])
        )
      ),
    ]),
  ],
})
export class SelectComponent extends ModalBaseComponent<ISelectOption> {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() options: ISelectOption[] = [];
  @Input() hideCancel = false;

  @Output() optionSelected = new EventEmitter<ISelectOption>();

  public timeout = SELECT_MODAL_TIMEOUT;

  public handleSelection(option: ISelectOption) {
    this.optionSelected.emit(option);
    if (option.style === EnumSelectOptionStyle.CANCEL) {
      this.close();
      return;
    }

    this.submitted.next(option);
  }

  public get fullOptions() {
    if (this.hideCancel) {
      return this.options;
    }
    return [
      ...this.options,
      { value: null, label: 'Annulla', style: EnumSelectOptionStyle.CANCEL },
    ];
  }

  public override async close() {
    super.close({ timeout: SELECT_MODAL_TIMEOUT });
  }
}
