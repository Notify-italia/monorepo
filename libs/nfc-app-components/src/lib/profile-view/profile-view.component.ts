import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProfileService } from '@notify/nfc-app-services';
import { EnumNotifyUserType, INotifyProfile } from '@notify/nfc-interfaces';
import { format } from 'date-fns';
import { interval, map, startWith } from 'rxjs';
import { AnimatedBgComponent } from '../animated-bg/animated-bg.component';
import { SvgBoxIconComponent } from '../svg-box-icon/svg-box-icon.component';

@Component({
  selector: 'notify-profile-view',
  standalone: true,
  imports: [CommonModule, SvgBoxIconComponent, AnimatedBgComponent],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent {
  @Input() data?: INotifyProfile;
  @Input() publicUrl = 'http://localhost:4200';
  @Input() mockup = false;

  public currentTime$ = interval(1000).pipe(
    startWith(0),
    map(() => format(new Date(), 'HH:mm'))
  );

  public enumProfileTypes = EnumNotifyUserType;

  public placeholderAvatarProvider =
    'https://www.heymind.org.uk/wp-content/uploads/2022/04/avatar-placeholder.png';

  constructor(private _profileService: ProfileService) {}

  public cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  public prepareUrl(url: string): string {
    return url?.startsWith('http') ? url : `https://${url}`;
  }

  public saveContact(): void {
    const d = this.data;

    console.log('saveContact', d);

    if (!d) {
      console.log('no data');
      return;
    }

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${d.surname};${d.name};
FN:${d.name} ${d.surname}
ORG:${d.company?.name || d.name}
TEL;TYPE=work,voice;VALUE=uri:${this.cleanPhoneNumber(d.phoneNumber || '')}
PHOTO;ENCODING=b:${d.avatar?.split(',')[1]}
item2.URL;type=pref:${this._profileService.getPublicProfileUrl(
      this.publicUrl,
      d._id
    )}
EMAIL:${d.email}
END:VCARD`;

    //saving the file by creating an anchor tag and simulating a click on it
    const a = document.createElement('a');
    a.setAttribute(
      'href',
      'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcard)
    );
    a.setAttribute('download', 'contact.vcf');
    a.click();
  }
}
