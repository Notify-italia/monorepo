import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumNotifyUserType, INotifyProfile } from '@notify/interfaces';
import {
  FeedbackService,
  ProfileService,
  SvgboxService,
  UtilsService,
} from '../../../../services';

import { ProfileDefaultViewComponent } from '../../presets/default-view/default-view.component';
import { ProfileOssidianaViewComponent } from '../../presets/ossidiana-view/ossidiana-view.component';
import { FeedbackFactory } from '../feedback/feedback.factory';
import { MockupFillComponent } from '../mockup-fill/mockup-fill.component';

export const defaultGradientStops = ['#0A2859', '#041127'];

@Component({
  selector: 'notify-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ProfileDefaultViewComponent,
    MockupFillComponent,
    ProfileOssidianaViewComponent,
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

  //TODO questa cosa è temporanea, va rimossa appena ci sarà la personalizzazione avanzata del profilo
  public get isOssidiana(): boolean {
    const ids = [
      '66084f260d1d685e63ecd722', //luca
      '660850080d1d685e63ecd88f', //giulio
      '660850a70d1d685e63ecd915', //Matteo
    ];

    return ids.includes(this.data?._id || '');
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
