import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { INotifyProfile } from '@notify/interfaces';
import { AvatarComponent } from '../../../../standalones/avatar/avatar.component';
import { ProfilePlayerFactory, RatingComponent } from '../../../profile';

@Component({
  selector: 'notify-widget-profile-card',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RatingComponent],
  providers: [ProfilePlayerFactory],
  templateUrl: './widget-profile-card.component.html',
  styleUrls: [
    './widget-profile-card.component.scss',
    '../../widgets.styles.scss',
  ],
})
export class WidgetProfileCardComponent {
  @Input({ required: true }) public title = '';
  @Input({ required: true }) profile!: INotifyProfile;
  @Input() public rating?: number;
  @Input() public ratingItems?: number;
  @Input() public baseUrl = '';
  @Input() backgroundColor = '#408558';

  constructor(private _router: Router) {}

  public inspect() {
    this._router.navigate(['/pages/analytics/detail'], {
      queryParams: {
        a: this.profile.owner,
      },
    });
  }
}
