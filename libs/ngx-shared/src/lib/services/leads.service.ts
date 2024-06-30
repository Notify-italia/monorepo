import { Injectable, inject } from '@angular/core';
import { INotifyLead, INotifyPopulatedLead } from '@notify/interfaces';
import JSZip from 'jszip';
import { HttpService } from './http.service';

@Injectable()
export class LeadsService {
  private _http = inject(HttpService);

  public createLead(lead: Partial<INotifyLead>) {
    return this._http.post<Partial<INotifyLead>, INotifyLead>(`/v1/lead`, lead);
  }

  public patchLead(lead: INotifyLead) {
    return this._http.patch<INotifyLead, INotifyLead>(`/v1/lead`, lead, {
      id: lead._id,
    });
  }

  public getLeads() {
    return this._http.get<INotifyLead[]>(`/v1/lead`);
  }

  public getLead(id: string) {
    return this._http.get<INotifyPopulatedLead>(`/v1/lead`, { id });
  }

  public exportLeads(
    leads: INotifyLead[],
    type: 'csv' | 'json' | 'vcard' | 'queryUser' = 'csv'
  ) {
    switch (type) {
      case 'csv':
        this._exportCSV(leads);
        break;
      case 'json':
        this._exportJSON(leads);
        break;
      case 'vcard':
        this._exportVCard(leads);
        break;
      case 'queryUser': {
        //TODO implement this
        break;
      }
    }
  }

  private _exportCSV(leads: INotifyLead[]) {
    const rows = leads.map((lead) => {
      return `${lead.name};${lead.surname};${lead.role};${lead.phoneNumbers};${lead.emails};${lead.company}`;
    });

    const csv = `Name;Surname;Role;Phone Numbers;Emails;Company\n${rows.join(
      '\n'
    )}`;

    const a = document.createElement('a');
    const blob = new Blob([csv], { type: 'text/csv' });

    a.href = URL.createObjectURL(blob);
    a.download = 'leads.csv';
    a.click();
  }

  private _exportJSON(leads: INotifyLead[]) {
    const a = document.createElement('a');
    const blob = new Blob([JSON.stringify(leads)], {
      type: 'application/json',
    });

    a.href = URL.createObjectURL(blob);
    a.download = 'leads.json';
    a.click();
  }

  private _exportVCard(leads: INotifyLead[]) {
    const vCards = leads.map((lead) => {
      return `BEGIN:VCARD
VERSION:3.0
N:${lead.surname};${lead.name};
FN:${lead.name} ${lead.surname}
ORG:${lead.company}
TITLE:${lead.role}
TEL;TYPE=WORK,VOICE:${lead.phoneNumbers}
EMAIL:${lead.emails}
END:VCARD`;
    });

    if (vCards.length === 1) {
      const vcard = vCards[0];

      //saving the file by creating an anchor tag and simulating a click on it
      const a = document.createElement('a');
      a.setAttribute(
        'href',
        'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcard)
      );
      a.setAttribute('download', `contatto_esportato.vcf`);
      a.click();
      return;
    } else {
      const zip = new JSZip();
      vCards.forEach((vcard, index) => {
        zip.file(`contatto_esportato_${index + 1}.vcf`, vcard);
      });
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'leads.zip';
        a.click();
      });
    }
  }
}
