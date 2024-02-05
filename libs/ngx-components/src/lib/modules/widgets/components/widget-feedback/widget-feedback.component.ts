import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RatingComponent } from '../../../profile-player';

@Component({
  selector: 'notify-widget-feedback',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  templateUrl: './widget-feedback.component.html',
  styleUrls: ['./widget-feedback.component.scss', '../../widgets.styles.scss'],
})
export class WidgetFeedbackComponent {
  @Input() value = 1;
  @Input() title = 'Feedback';
  @Input() maxRating = 5;
}
