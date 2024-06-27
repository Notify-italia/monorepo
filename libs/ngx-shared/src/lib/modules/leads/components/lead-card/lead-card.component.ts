import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { INotifyLead } from '@notify/interfaces';
import { CapacitorService, UtilsService } from '../../../../services';

@Component({
  selector: 'notify-lead-card',
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService, CapacitorService],
  templateUrl: './lead-card.component.html',
  styleUrl: './lead-card.component.scss',
})
export class LeadCardComponent {
  private _utilsSerivce = inject(UtilsService);
  private _capacitorService = inject(CapacitorService);
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
    const options = this.lead[
      protocol === 'tel' ? 'phoneNumbers' : 'emails'
    ].map((v) => ({
      title: v,
    }));

    if (this.lead.phoneNumbers.length === 1) {
      window.location.href = `${protocol}:${options[0].title}`;
      return;
    }

    const _title =
      protocol === 'tel'
        ? 'un numero di telefono da chiamare'
        : 'una mail a cui scrivere';
    const result = await this._capacitorService.modal({
      title: `Seleziona ${_title}`,
      message: '',
      options,
    });

    if (!result) {
      return;
    }

    window.location.href = `${protocol}:${options[result.index].title}`;
  }
}
