import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EnumNotifyAPBackgroundTypes,
  EnumNotifyUserType,
  INotifyProfile,
} from '@notify/interfaces';
import {
  FeedbackService,
  ProfileService,
  SvgboxService,
  UtilsService,
} from '../../../../services';

import { AdvancedViewComponent } from '../../views/advanced-view/advanced-view.component';
import { ProfileDefaultViewComponent } from '../../views/default-view/default-view.component';
import { ProfileNewEraViewComponent } from '../../views/newera-view/newera-view.component';
import { ProfileOssidianaViewComponent } from '../../views/ossidiana-view/ossidiana-view.component';
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
    ProfileNewEraViewComponent,
    AdvancedViewComponent,
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

  public get viewNgClass() {
    return {
      'display pt-20 notify-scrollbar scrollbar-absolute scrollbar-white':
        this.mockup,
      'h-full  min-h-screen  w-screen': !this.mockup,
    };
  }

  public get mockupFillColor(): string {
    if (!this.data?.advancedProfile?.enabled) {
      return this.data?.colors.background[0] || '';
    }

    switch (this._pageSettings?.backgroundType) {
      case EnumNotifyAPBackgroundTypes.Gradient: {
        return this._pageSettings.gradient.colors[0];
      }

      default:
        return this._pageSettings?.fill || '';
    }
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

  public get isNewEra(): boolean {
    const ids = ['660c6cf57cb125be66b84962'];

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

  private get _pageSettings() {
    return this.data?.advancedProfile?.pageSettings;
  }

  constructor(public profileService: ProfileService) {}

  public ngOnInit(): void {
    this.componentReady.emit();
  }
}
