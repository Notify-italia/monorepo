import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  EnumNotifyUserType,
  INotifyFeedback,
  INotifyProfile,
} from '@notify/interfaces';
import { FeedbackService, ProfileService } from '@notify/nfc-app-services';
import { format } from 'date-fns';
import { interval, map, startWith } from 'rxjs';
import { FeedbackFactory } from '../../../factories';
import { AnimatedBgComponent } from '../../animated-bg/animated-bg.component';
import { AvatarComponent } from '../../avatar/avatar.component';
import { SvgBoxIconComponent } from '../../svg-box-icon/svg-box-icon.component';
import { ProfileStaticLinksComponent } from '../profile-static-links/profile-static-links.component';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'notify-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    SvgBoxIconComponent,
    AnimatedBgComponent,
    AvatarComponent,
    ProfileStaticLinksComponent,
    RatingComponent,
  ],
  providers: [FeedbackFactory, FeedbackService],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss', '../profile.styles.scss'],
})
export class ProfileViewComponent {
  @Input() data?: INotifyProfile;
  @Input({ required: true }) publicUrl = 'http://localhost:4200';
  @Input() mockup = false;
  @Input() feedbackKey = 'feedback';

  public currentTime$ = interval(1000).pipe(
    startWith(0),
    map(() => format(new Date(), 'HH:mm'))
  );

  public enumProfileTypes = EnumNotifyUserType;

  constructor(
    private _profileService: ProfileService,
    private _feedbackFactory: FeedbackFactory,
    private _feedbackService: FeedbackService
  ) {}

  public feedbackGiven(): INotifyFeedback | null {
    if (!this.data?._id) {
      return null;
    }

    const fb = this._feedbackService.getFeedbackFromLocalStorage(
      this.data?.owner,
      this.feedbackKey
    );

    return fb;
  }

  public prepareUrl(url: string): string {
    return url?.startsWith('http') ? url : `https://${url}`;
  }

  public showFeedback(): void {
    if (!this.data) {
      return;
    }

    this._feedbackFactory.show({
      profile: this.data,
      feedbackKey: this.feedbackKey,
    });
  }

  public saveContact(): void {
    const d = this.data;

    if (!d) {
      console.log('no data');
      return;
    }

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${d.surname};${d.name};
FN:${d.name} ${d.surname}
ORG:${d.company?.name || d.name}
TEL;TYPE=work,voice;VALUE=uri:${this._profileService.cleanPhoneNumber(
      d.phoneNumber || ''
    )}
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
