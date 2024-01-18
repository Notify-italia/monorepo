import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  EnumNotifyUserType,
  INotifyFeedback,
  INotifyProfile,
} from '@notify/interfaces';
import {
  FeedbackService,
  ProfileService,
  SvgboxService,
  UtilsService,
} from '@notify/nfc-app-services';
import { format } from 'date-fns';
import { interval, map, startWith } from 'rxjs';
import { AnimatedBgComponent } from '../../../../standalones/animated-bg/animated-bg.component';
import { AvatarComponent } from '../../../../standalones/avatar/avatar.component';
import { GoogleMapsComponent } from '../../../../standalones/google-maps/google-maps.component';
import { SvgBoxIconComponent } from '../../../../standalones/svg-box-icon/svg-box-icon.component';
import { FeedbackFactory } from '../../factories';
import { ProfileIntegrationsComponent } from '../profile-integrations/profile-integrations.component';
import { ProfileStaticLinksComponent } from '../profile-static-links/profile-static-links.component';
import { RatingComponent } from '../rating/rating.component';

const defaultGradientStops = ['#0A2859', '#041127'];

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
    GoogleMapsComponent,
    ProfileIntegrationsComponent,
  ],
  providers: [FeedbackFactory, FeedbackService, SvgboxService, UtilsService],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss', '../profile.styles.scss'],
})
export class ProfileViewComponent {
  @Input() data?: INotifyProfile;
  @Input({ required: true }) publicUrl = 'http://localhost:4200';
  @Input() mockup = false;
  @Input() feedbackKey = 'feedback';

  @Output() subAvatarClick = new EventEmitter<void>();

  public currentTime$ = interval(1000).pipe(
    startWith(0),
    map(() => format(new Date(), 'HH:mm'))
  );

  public get isAgent(): boolean {
    return this.data?.type === EnumNotifyUserType.Agent;
  }

  public get cssGradientStops(): string {
    const colors = this.data?.colors?.background;

    if (this.data?.colors?.useCompanyColors) {
      return (
        this.data.company?.colors?.background.join(',') ||
        defaultGradientStops.join(',')
      );
    }

    if (!colors?.length) {
      return defaultGradientStops.join(',');
    }

    if (colors.length === 1) {
      return [colors[0], colors[0]].join(',');
    }

    return colors.join(',');
  }

  public get cssElementsColor(): string {
    if (this.data?.colors?.useCompanyColors) {
      return this.data.company?.colors?.elements || '#ffffff';
    }

    return this.data?.colors?.elements || '#ffffff';
  }

  constructor(
    public profileService: ProfileService,
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

  public showFeedback(): void {
    if (!this.data || this.feedbackGiven() || this.mockup) {
      return;
    }

    this._feedbackFactory.createFeedback({
      profile: this.data,
      feedbackKey: this.feedbackKey,
    });
  }

  public redirectToReview(): void {
    if (!this.data?.reviewRedirect) {
      return;
    }

    window.open(this.data.reviewRedirect, '_blank');
  }

  public getContrastingColor(color: string, styleProp: string) {
    //return white or black, depending on the one that contrasts the most with the given color

    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const yiq = (r * 299 + g * 587 + b * 114) / 1000; // Calculate the perceptive luminance (aka luma) - human eye favors green color...
    const value = yiq >= 128 ? 'black' : 'white'; // ... So we'll use that as the benchmark.

    return { [styleProp]: value };
  }
}
