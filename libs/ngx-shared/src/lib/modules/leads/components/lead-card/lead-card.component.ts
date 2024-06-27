import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { INotifyLead } from '@notify/interfaces';
import { take, tap } from 'rxjs';
import { UtilsService } from '../../../../services';
import { SELECT_MODAL_TIMEOUT } from '../../../modals';
import { SelectModalFactory } from '../../../modals/select/select-modal.factory';

@Component({
  selector: 'notify-lead-card',
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService, SelectModalFactory],
  templateUrl: './lead-card.component.html',
  styleUrl: './lead-card.component.scss',
})
export class LeadCardComponent {
  private _utilsSerivce = inject(UtilsService);

  private _selectModalFactory = inject(SelectModalFactory);
  @Input({ required: true }) lead!: INotifyLead;

  @Output() public cardClicked = new EventEmitter<INotifyLead>();

  public get mainAlias(): string {
    if (this.isPerson) {
      return `${this.lead.name} ${this.lead.surname}`.trim();
    }

    return (
      this.lead.company ||
      this.lead.emails?.[0] ||
      this.lead.phoneNumbers?.[0] ||
      'Nessun alias'
    );
  }

  public get isPerson() {
    return !!(this.lead.name?.length || this.lead.surname?.length);
  }

  public get colors() {
    const color = this.lead.color || '#5845b5';

    return {
      color: this._utilsSerivce.getContrastingColor(color),
      'background-color': color,
    };
  }

  public get mainEmail() {
    return this.lead.emails?.[0];
  }

  public get mainPhoneNumber() {
    return this.lead.phoneNumbers?.[0];
  }

  public async executeCardAction(protocol: 'mailto' | 'tel') {
    const isTel = protocol === 'tel';
    const options = this.lead[isTel ? 'phoneNumbers' : 'emails'].map((v) => ({
      label: isTel ? _phoneNumberMaskPipe(v) : v,
      value: v,
    }));

    if (this.lead.phoneNumbers.length === 1) {
      window.location.href = `${protocol}:${options[0].value}`;
      return;
    }

    const _title = isTel
      ? 'Più numeri di telefono disponibili'
      : 'Più email disponibili';
    const _subtitle = isTel
      ? 'un numero di telefono da chiamare'
      : 'una e-mail a cui scrivere';

    const ref = this._selectModalFactory.create({
      title: _title,
      subtitle: `Seleziona ${_subtitle}`,
      options,
    });

    ref.instance.submitted
      .pipe(
        take(1),
        tap(async (v) => {
          if (!v) {
            return ref.instance.close({ timeout: SELECT_MODAL_TIMEOUT });
          }

          await ref.instance.close({ timeout: SELECT_MODAL_TIMEOUT });
          window.location.href = `${protocol}:${v.value}`;
        })
      )
      .subscribe();
  }
}

const _phoneNumberMaskPipe = (value: string) => {
  if (!value) {
    return '';
  }

  if (value.startsWith('0')) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d{3})(\d{2,3})/, '$1 $2 $3');
  }

  return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
};
