import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { INotifyProfile } from '@notify/interfaces';
import {
  GoogleMapsComponent,
  SvgBoxIconComponent,
  WallpaperComponent,
} from '../../../../../lib/standalones';
import { ProfileService } from '../../../../services';
import { NoteViewComponent } from '../../../notes';
import { FeedbackButtonComponent } from '../../components/feedback-button/feedback-button.component';
import { MockupFillComponent } from '../../components/mockup-fill/mockup-fill.component';
import { ProfileIntegrationsComponent } from '../../components/profile-integrations/profile-integrations.component';
import { ProfileStaticLinksComponent } from '../../components/profile-static-links/profile-static-links.component';
import { ProfileUserInfoComponent } from '../../components/profile-user-info/profile-user-info.component';
import { RatingComponent } from '../../components/rating/rating.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SvgBoxIconComponent,
    WallpaperComponent,
    ProfileStaticLinksComponent,
    RatingComponent,
    GoogleMapsComponent,
    ProfileIntegrationsComponent,
    MockupFillComponent,
    FeedbackButtonComponent,
    ProfileUserInfoComponent,
    NoteViewComponent,
  ],
  providers: [ProfileService],
  selector: '[notify-profile-default-view]',
  templateUrl: './default-view.component.html',
})
export class ProfileDefaultViewComponent {
  public profileService = inject(ProfileService);

  @Input({ required: true }) data?: INotifyProfile;
  @Input({ required: true }) cssElementsColor!: string;
  @Input({ required: true }) isAgent!: boolean;
  @Input({ required: true }) cssGradientStops!: string;
  @Input({ required: true }) isFeedbackEnabled!: boolean;
  @Input({ required: true }) feedbackKey!: string;

  @Output() integrationClicked = new EventEmitter<
    INotifyProfile['customFields'][0]
  >();
  @Output() feedbackClicked = new EventEmitter<void>();
  @Output() subAvatarClick = new EventEmitter<void>();

  public get noteOptions() {
    return {
      ...(this.data?.noteOptions ?? { showTitle: true }),
      textColor: this.cssElementsColor,
    };
  }
}
