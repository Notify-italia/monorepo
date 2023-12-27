import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import { GesturesDirective, ProfileService } from '@notify/nfc-app-services';
import { ProfileViewComponent } from '@notify/ngx-components';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'notify-profile',
  standalone: true,
  imports: [CommonModule, ProfileViewComponent, GesturesDirective],
  providers: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public profile$: Observable<INotifyProfile>;
  public publicUrl = environment.publicUrl;
  public feedbackKey = environment.feedbackKey;

  public profileScale = 1;
  public companyProfileX = 100;
  public companyIsVisible = false;

  private _thresholds = {
    minScale: 0.9,
    maxScale: 1,
    minTranslate: 0,
    maxTranslate: 100,
    //the higher the number, the less the user has to swipe to show/hide the company profile
    horizontalSwipe: 70,
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _profileService: ProfileService,
    private _titleService: Title,
    private _router: Router
  ) {
    this.profile$ = this._profileService
      .getProfile(
        this._activatedRoute.snapshot.queryParamMap.get('p') as string
      )
      .pipe(
        tap((profile) => {
          this._titleService.setTitle(`${profile.name} - Notify`);
        }),
        catchError((err) => {
          this._router.navigate(['/404']);
          throw new Error(err);
        })
      );
  }

  public isAgent(profile: INotifyProfile): boolean {
    return profile.type === EnumNotifyUserType.Agent;
  }

  public handleHorizontalSwipe($event: number) {
    let normalizedValue = 100 + $event;

    if (this.companyIsVisible) {
      normalizedValue = $event;
    }

    if (normalizedValue < this._thresholds.minTranslate) {
      normalizedValue = 0;
    }

    if (normalizedValue > this._thresholds.maxTranslate) {
      this.companyProfileX = 100;
      this.profileScale = 1;
      return;
    }

    this.companyProfileX = normalizedValue;

    this._handleScaleChange($event);
  }

  public handleTouchEnd() {
    const _hThreshold = this.companyIsVisible
      ? 100 - this._thresholds.horizontalSwipe
      : this._thresholds.horizontalSwipe;

    if (this.companyProfileX < _hThreshold) {
      this.companyProfileX = 0;
      this.profileScale = this._thresholds.minScale;
      this.companyIsVisible = true;
      return;
    }

    this.companyIsVisible = false;
    this.companyProfileX = 100;
    this.profileScale = this._thresholds.maxScale;
  }

  private _handleScaleChange($event: number) {
    //decrease the scale until it reaches the minimum threshold if the company profile is not visible
    if (!this.companyIsVisible) {
      this.profileScale =
        this._thresholds.minScale +
        (this._thresholds.maxScale - this._thresholds.minScale) *
          (this._thresholds.maxScale - Math.abs($event) / 100);

      return;
    }

    //increse the scale until it reaches the maximum threshold if the company profile is visible
    this.profileScale =
      this._thresholds.minScale +
      (this._thresholds.maxScale - this._thresholds.minScale) *
        (Math.abs($event) / 100);
  }

  public saveContact(d: INotifyProfile): void {
    if (!d) {
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
item2.URL;type=pref:${this._profileService.genPlayerUrl(this.publicUrl, d._id)},
ADR;TYPE=work:;;${this._profileService.buildCompanyLocation(
      d?.company?.address
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
