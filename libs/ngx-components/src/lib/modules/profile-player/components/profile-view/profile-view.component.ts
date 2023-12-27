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
import { AnimatedBgComponent } from '../../../../standalones/animated-bg/animated-bg.component';
import { AvatarComponent } from '../../../../standalones/avatar/avatar.component';
import { GoogleMapsComponent } from '../../../../standalones/google-maps/google-maps.component';
import { SvgBoxIconComponent } from '../../../../standalones/svg-box-icon/svg-box-icon.component';
import { FeedbackFactory } from '../../factories';
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
    GoogleMapsComponent,
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
  @Input() showFooter = true;

  public currentTime$ = interval(1000).pipe(
    startWith(0),
    map(() => format(new Date(), 'HH:mm'))
  );

  public get isAgent(): boolean {
    return this.data?.type === EnumNotifyUserType.Agent;
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

  public prepareUrl(url: string): string {
    return url?.startsWith('http') ? url : `https://${url}`;
  }

  public showFeedback(): void {
    if (!this.data) {
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
}
