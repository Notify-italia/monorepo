import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { INotifyLead } from '@notify/interfaces';
import { UtilsService } from '../../../services';

@Component({
  selector: 'notify-lead-card',
  standalone: true,
  imports: [CommonModule],
  providers: [UtilsService],
  templateUrl: './lead-card.component.html',
  styleUrl: './lead-card.component.scss',
})
export class LeadCardComponent {
  private _utilsSerivce = inject(UtilsService);
  @Input({ required: true }) lead!: INotifyLead;

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

  public executeCardAction(value: string, protocol: 'mailto' | 'tel') {
    window.location.href = `${protocol}:${value}`;
  }
}
