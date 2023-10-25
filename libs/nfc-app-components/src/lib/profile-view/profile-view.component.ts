import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProfileFormComponent } from '../profile-form/profile-form.component';

@Component({
  selector: 'notify-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent {
  @Input() data?: ProfileFormComponent['form']['value'] & {
    company?: {
      name: string;
    };
  };
  @Input() mockup = false;

  public placeholderAvatarProvider =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';

  public cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  public saveContact(): void {
    const d = this.data;

    if (!d) {
      return;
    }

    //TODO aggiungi avatar e sito web alla vcard
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${d.surname};${d.name};
FN:${d.name} ${d.surname}
ORG:${d.company?.name}
TEL;TYPE=work,voice;VALUE=uri:${this.cleanPhoneNumber(d.phoneNumber || '')}
EMAIL:${d.email}
END:VCARD`;

    const a = document.createElement('a');
    a.setAttribute(
      'href',
      'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcard)
    );
    a.setAttribute('download', 'contact.vcf');
    a.click();
  }
}
