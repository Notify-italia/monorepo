import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INotifyLead } from '@notify/interfaces';

@Component({
  selector: 'notify-lead-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-card.component.html',
  styleUrl: './lead-card.component.scss',
})
export class LeadCardComponent {
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
}
