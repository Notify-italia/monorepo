import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import {
  FeedbackService,
  ProfileService,
  SvgboxService,
  UtilsService,
} from '../../../../services';
import { WallpaperComponent } from '../../../../standalones/animated-bg/wallpaper.component';
import { GoogleMapsComponent } from '../../../../standalones/google-maps/google-maps.component';
import { SvgBoxIconComponent } from '../../../../standalones/svg-box-icon/svg-box-icon.component';
import { FeedbackFactory } from '../../factories';
import { FeedbackButtonComponent } from '../feedback-button/feedback-button.component';
import { MockupFillComponent } from '../mockup-fill/mockup-fill.component';
import { ProfileIntegrationsComponent } from '../profile-integrations/profile-integrations.component';
import { ProfileStaticLinksComponent } from '../profile-static-links/profile-static-links.component';
import { ProfileUserInfoComponent } from '../profile-user-info/profile-user-info.component';
import { RatingComponent } from '../rating/rating.component';

export const defaultGradientStops = ['#0A2859', '#041127'];

@Component({
  selector: 'notify-profile-view',
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
  ],
  providers: [
    FeedbackFactory,
    FeedbackService,
    SvgboxService,
    UtilsService,
    ProfileService,
  ],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss', '../profile.styles.scss'],
})
export class ProfileViewComponent implements OnInit {
  @Input() data?: INotifyProfile;
  @Input() mockup = false;
  @Input() feedbackKey = 'feedback';

  @Output() subAvatarClick = new EventEmitter<void>();
  @Output() public integrationClicked = new EventEmitter<
    INotifyProfile['customFields'][0]
  >();
  @Output() public feedbackClicked = new EventEmitter<void>();
  @Output() public componentReady = new EventEmitter<void>();

  public get isAgent(): boolean {
    return this.data?.type === EnumNotifyUserType.Agent;
  }

  public get isFeedbackEnabled(): boolean {
    return this.data?.config?.feedbackEnabled || !this.isAgent;
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

  constructor(public profileService: ProfileService) {}

  public ngOnInit(): void {
    this.componentReady.emit();
  }
}
